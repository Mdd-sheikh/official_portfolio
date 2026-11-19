"use client";

import { useEffect, useState } from "react";
import { Reveal } from "@/components/Fx";

const SECRET = "demo_secret_only_the_server_knows";
const ORDER = "order_Q7x2KmPa91";
const GENUINE = { paymentId: "pay_Q7x3ZnLb42", amount: 1499 };

async function hmac(message: string, secret: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// compares every character so timing does not leak where the mismatch is
function safeEqual(a: string, b: string) {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

const sign = (paymentId: string, amount: number) => hmac(`${ORDER}|${paymentId}|${amount}`, SECRET);

type Log = { ok: boolean; text: string };

export default function SignatureLab() {
  const [paymentId, setPaymentId] = useState(GENUINE.paymentId);
  const [amount, setAmount] = useState(GENUINE.amount);
  const [genuineSig, setGenuineSig] = useState("");
  const [sentSig, setSentSig] = useState("");
  const [serverSig, setServerSig] = useState("");
  const [log, setLog] = useState<Log[]>([]);
  const [verdict, setVerdict] = useState<null | boolean>(null);

  const payload = `${ORDER}|${paymentId}|${amount}`;

  // the signature the gateway issued for the real payment
  useEffect(() => {
    sign(GENUINE.paymentId, GENUINE.amount).then((s) => { setGenuineSig(s); setSentSig(s); });
  }, []);

  // what the server recomputes from whatever the browser sent
  useEffect(() => {
    let live = true;
    sign(paymentId, amount).then((s) => { if (live) setServerSig(s); });
    return () => { live = false; };
  }, [paymentId, amount]);

  const verify = async () => {
    const expected = await sign(paymentId, amount);
    const ok = safeEqual(expected, sentSig);
    setVerdict(ok);
    setLog((l) => [{ ok, text: ok ? `Verified: ${paymentId} for ₹${amount} accepted, order marked PAID` : `Rejected: signature does not match ${paymentId} / ₹${amount}, order stays UNPAID` }, ...l].slice(0, 4));
  };

  const reset = () => { setPaymentId(GENUINE.paymentId); setAmount(GENUINE.amount); setSentSig(genuineSig); setVerdict(null); };
  const tampered = paymentId !== GENUINE.paymentId || amount !== GENUINE.amount;

  return (
    <section className="lab" id="signature" aria-labelledby="sig-title">
      <Reveal>
        <p className="eyebrow">Trust no browser</p>
        <h2 id="sig-title" className="section-title">Try to cheat the payment check</h2>
        <p className="panel-lead">This is how my servers verify a payment. The genuine signature is already filled in. Change the amount or payment ID, then press verify. A real HMAC-SHA256 runs in your browser.</p>
      </Reveal>

      <Reveal delay={0.1} className="glass lab-card sig">
        <div className="sig-grid">
          <div className="sig-pane">
            <h3>Browser (untrusted)</h3>
            <label>Order ID<input value={ORDER} readOnly /></label>
            <label>Payment ID<input value={paymentId} onChange={(e) => { setPaymentId(e.target.value); setVerdict(null); }} spellCheck={false} /></label>
            <label>Amount paid (₹)<input type="number" min={0} value={amount} onChange={(e) => { setAmount(+e.target.value || 0); setVerdict(null); }} /></label>
            <label>Signature sent<input value={sentSig} onChange={(e) => { setSentSig(e.target.value); setVerdict(null); }} spellCheck={false} className="mono" /></label>
            <div className="sig-btns">
              <button type="button" className="opt" onClick={() => { setAmount(1); setVerdict(null); }}>Cheat: pay ₹1</button>
              <button type="button" className="opt" onClick={() => { setSentSig("0".repeat(64)); setVerdict(null); }}>Cheat: fake signature</button>
              <button type="button" className="opt" onClick={reset}>Reset</button>
            </div>
          </div>

          <div className="sig-arrow" aria-hidden="true">→</div>

          <div className="sig-pane srv">
            <h3>Server (trusted)</h3>
            <p className="lab-sub">The secret key never leaves the server:</p>
            <code className="mono dim">{SECRET.slice(0, 9)}••••••••••••••••••</code>
            <p className="lab-sub">It recomputes the signature itself:</p>
            <code className="mono">HMAC_SHA256(&quot;{payload}&quot;)</code>
            <code className="mono sig-hash">{serverSig ? serverSig.slice(0, 32) + "…" : "…"}</code>
            <button type="button" className="pill lab-cta" onClick={verify}>Verify payment</button>
            <div className="verdict" data-state={verdict === null ? "idle" : verdict ? "ok" : "bad"} role="status">
              {verdict === null ? (tampered ? "Data changed. Press verify." : "Waiting for verification") : verdict ? "✔ Signature valid" : "✖ Tampering detected"}
            </div>
          </div>
        </div>

        {log.length > 0 && (
          <ul className="sig-log" aria-label="Verification log">
            {log.map((l, i) => <li key={i} data-ok={l.ok}>{l.text}</li>)}
          </ul>
        )}
      </Reveal>
    </section>
  );
}
