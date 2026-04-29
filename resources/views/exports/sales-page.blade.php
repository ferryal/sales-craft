<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{ $page->title }}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}body{font-family:Inter,sans-serif}
.hero{background:linear-gradient(160deg,#0B1A02,#1A2E05);padding:96px 40px;text-align:center}
.hero-badge{font-size:10px;color:#A3E635;letter-spacing:.15em;text-transform:uppercase;margin-bottom:20px}
.hero h1{font-family:'Space Grotesk',sans-serif;font-size:50px;font-weight:700;color:#F4F4F5;max-width:640px;margin:0 auto 20px;line-height:1.1;letter-spacing:-1px}
.hero p{font-size:20px;color:rgba(244,244,245,.7);max-width:500px;margin:0 auto 40px;line-height:1.6}
.btn-lime{height:50px;padding:0 36px;border-radius:6px;border:none;background:linear-gradient(135deg,#A3E635,#84CC16);color:#0B0C0B;font-weight:700;font-size:16px;cursor:pointer;font-family:Inter,sans-serif}
.benefits{background:#F8F8F6;padding:80px 40px;text-align:center}
.section-label{font-size:10px;color:#71717A;letter-spacing:.12em;text-transform:uppercase;margin-bottom:12px}
.section-title{font-family:'Space Grotesk',sans-serif;font-size:28px;font-weight:700;color:#18181B;margin-bottom:40px;letter-spacing:-.5px}
.grid-3{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px;max-width:860px;margin:0 auto}
.card{background:#fff;border:1px solid #E4E4E7;border-radius:8px;padding:24px;box-shadow:0 1px 4px rgba(0,0,0,.05);text-align:left}
.dot{width:20px;height:20px;background:#A3E635;border-radius:4px;margin-bottom:14px}
.features{background:#fff;padding:80px 40px}
.features-inner{max-width:860px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}
.feature-item{display:flex;align-items:flex-start;gap:10;margin-bottom:14px}
.check{width:18px;height:18px;border-radius:50%;background:#A3E635;flex-shrink:0;margin-top:2px}
.testimonials{background:#0B1A02;padding:80px 40px}
.testimonials-inner{max-width:860px;margin:0 auto}
.tcard{background:#111311;border:1px solid #1A2E05;border-radius:8px;padding:24px}
.tgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px}
.avatar{width:36px;height:36px;border-radius:50%;background:#A3E635;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:#0B0C0B}
.pricing{background:#F8F8F6;padding:80px 40px;text-align:center}
.price{font-family:'Space Grotesk',sans-serif;font-size:56px;font-weight:700;color:#18181B;line-height:1}
.footer-cta{background:linear-gradient(160deg,#0B1A02,#1A2E05);padding:96px 40px;text-align:center}
.footer-cta h2{font-family:'Space Grotesk',sans-serif;font-size:40px;font-weight:700;color:#F4F4F5;max-width:560px;margin:0 auto 36px;line-height:1.15;letter-spacing:-.5px}
.btn-outline{height:50px;padding:0 36px;border-radius:6px;background:transparent;border:1px solid #A3E635;color:#A3E635;font-weight:600;font-size:15px;cursor:pointer;font-family:Inter,sans-serif}
</style>
</head>
<body>
@php $d = $page->output_data; @endphp

<div class="hero">
  <div class="hero-badge">SALESCRAFT AI · GENERATED</div>
  <h1>{{ $d['headline'] ?? '' }}</h1>
  <p>{{ $d['sub_headline'] ?? '' }}</p>
  <button class="btn-lime">{{ $d['cta']['button_text'] ?? 'Get Started' }} →</button>
</div>

<div class="benefits">
  <div class="section-label">WHY IT WORKS</div>
  <div class="section-title">{{ $d['description'] ?? '' }}</div>
  <div class="grid-3">
    @foreach($d['benefits'] ?? [] as $benefit)
    <div class="card"><div class="dot"></div><p style="font-size:15px;color:#52525B;line-height:1.6">{{ $benefit }}</p></div>
    @endforeach
  </div>
</div>

<div class="features">
  <div class="features-inner">
    <div>
      <div style="font-size:10px;color:#A3E635;text-transform:uppercase;letter-spacing:.12em;margin-bottom:12px">Features</div>
      <h2 style="font-family:'Space Grotesk',sans-serif;font-size:26px;font-weight:700;color:#18181B;margin-bottom:24px">Everything you need</h2>
      @foreach($d['features'] ?? [] as $f)
      <div class="feature-item"><div class="check"></div><div><strong style="font-size:15px;color:#18181B">{{ $f['title'] }}</strong><p style="font-size:14px;color:#52525B;margin-top:2px">{{ $f['description'] }}</p></div></div>
      @endforeach
    </div>
    <div style="height:220px;border-radius:8px;border:1px solid #E4E4E7;background:repeating-linear-gradient(45deg,#f5f5f5 0,#f5f5f5 1px,#fafafa 1px,#fafafa 14px);display:flex;align-items:center;justify-content:center"><span style="font-size:11px;color:#A0A0A0">product screenshot</span></div>
  </div>
</div>

<div class="testimonials">
  <div class="testimonials-inner">
    <div class="section-label" style="text-align:center">What customers say</div>
    <h2 style="font-family:'Space Grotesk',sans-serif;font-size:26px;font-weight:700;color:#F4F4F5;text-align:center;margin-bottom:40px">Trusted by closers</h2>
    <div class="tgrid">
      @foreach($d['testimonials'] ?? [] as $t)
      <div class="tcard">
        <p style="font-size:15px;color:#F4F4F5;font-style:italic;line-height:1.7;margin-bottom:20px">"{{ $t['quote'] }}"</p>
        <div style="display:flex;align-items:center;gap:10px">
          <div class="avatar">{{ strtoupper(substr($t['name'] ?? '?', 0, 1)) }}</div>
          <div><div style="font-size:14px;font-weight:500;color:#F4F4F5">{{ $t['name'] }}</div><div style="font-size:12px;color:#71717A">{{ $t['role'] }}</div></div>
        </div>
      </div>
      @endforeach
    </div>
  </div>
</div>

<div class="pricing">
  <div style="font-size:11px;color:#71717A;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px">Simple pricing</div>
  <div class="price">{{ $d['pricing']['price'] ?? '' }}</div>
  <div style="font-size:14px;color:#71717A;margin-top:8px;margin-bottom:36px">{{ $d['pricing']['billing'] ?? '' }}</div>
  <button class="btn-lime">{{ $d['pricing']['cta_text'] ?? 'Get Started' }}</button>
  @if(!empty($d['pricing']['urgency']))
  <div style="margin-top:16px;font-size:13px;color:#F97316">⚡ {{ $d['pricing']['urgency'] }}</div>
  @endif
</div>

<div class="footer-cta">
  <h2>{{ $d['cta']['supporting_text'] ?? 'Ready to get started?' }}</h2>
  <button class="btn-outline">{{ $d['cta']['button_text'] ?? 'Get Started' }}</button>
</div>

</body>
</html>
