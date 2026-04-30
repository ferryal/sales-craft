<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{ $page->title }}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet">
@php
$d   = $page->output_data;
$tpl = $page->input_data['template'] ?? 'dark';

$themes = [
    'dark' => [
        'heroBg'      => 'linear-gradient(160deg,#0B1A02,#1A2E05)',
        'heroTitle'   => '#F4F4F5',
        'heroSub'     => 'rgba(244,244,245,0.7)',
        'accent'      => '#A3E635',
        'accentDark'  => '#84CC16',
        'accentText'  => '#0B0C0B',
        'sectionBg'   => '#F8F8F6',
        'sectionText' => '#18181B',
        'cardBg'      => '#fff',
        'cardBorder'  => '#E4E4E7',
        'bodyText'    => '#52525B',
        'mutedText'   => '#71717A',
        'darkBg'      => '#0B1A02',
        'darkTitle'   => '#F4F4F5',
        'darkCard'    => '#111311',
        'darkBorder'  => '#1A2E05',
        'darkText'    => '#F4F4F5',
        'pricingBg'   => '#F8F8F6',
        'priceColor'  => '#18181B',
        'urgency'     => '#F97316',
    ],
    'light' => [
        'heroBg'      => 'linear-gradient(160deg,#EFF6FF,#DBEAFE)',
        'heroTitle'   => '#18181B',
        'heroSub'     => '#52525B',
        'accent'      => '#3B82F6',
        'accentDark'  => '#2563EB',
        'accentText'  => '#fff',
        'sectionBg'   => '#F8FAFC',
        'sectionText' => '#18181B',
        'cardBg'      => '#fff',
        'cardBorder'  => '#E2E8F0',
        'bodyText'    => '#374151',
        'mutedText'   => '#64748B',
        'darkBg'      => '#1E3A5F',
        'darkTitle'   => '#F0F9FF',
        'darkCard'    => 'rgba(255,255,255,0.08)',
        'darkBorder'  => 'rgba(255,255,255,0.15)',
        'darkText'    => '#F0F9FF',
        'pricingBg'   => '#EFF6FF',
        'priceColor'  => '#1E3A5F',
        'urgency'     => '#DC2626',
    ],
    'bold' => [
        'heroBg'      => '#09090B',
        'heroTitle'   => '#FAFAFA',
        'heroSub'     => '#A1A1AA',
        'accent'      => '#F97316',
        'accentDark'  => '#EA6B00',
        'accentText'  => '#09090B',
        'sectionBg'   => '#F4F4F5',
        'sectionText' => '#09090B',
        'cardBg'      => '#fff',
        'cardBorder'  => '#E4E4E7',
        'bodyText'    => '#374151',
        'mutedText'   => '#71717A',
        'darkBg'      => '#09090B',
        'darkTitle'   => '#FAFAFA',
        'darkCard'    => '#18181B',
        'darkBorder'  => '#27272A',
        'darkText'    => '#FAFAFA',
        'pricingBg'   => '#F4F4F5',
        'priceColor'  => '#09090B',
        'urgency'     => '#F97316',
    ],
];
$th = $themes[$tpl] ?? $themes['dark'];
@endphp
<style>
*{box-sizing:border-box;margin:0;padding:0}body{font-family:Inter,sans-serif}
</style>
</head>
<body>

{{-- HERO --}}
<div style="background:{{ $th['heroBg'] }};padding:96px 40px;text-align:center">
  <div style="font-size:10px;color:{{ $th['accent'] }};letter-spacing:.15em;text-transform:uppercase;margin-bottom:20px">SALESCRAFT AI · GENERATED</div>
  <h1 style="font-family:'Space Grotesk',sans-serif;font-size:50px;font-weight:700;color:{{ $th['heroTitle'] }};max-width:640px;margin:0 auto 20px;line-height:1.1;letter-spacing:-1px">{{ $d['headline'] ?? '' }}</h1>
  <p style="font-size:20px;color:{{ $th['heroSub'] }};max-width:500px;margin:0 auto 40px;line-height:1.6">{{ $d['sub_headline'] ?? '' }}</p>
  <button style="height:50px;padding:0 36px;border-radius:6px;border:none;background:linear-gradient(135deg,{{ $th['accent'] }},{{ $th['accentDark'] }});color:{{ $th['accentText'] }};font-weight:700;font-size:16px;cursor:pointer;font-family:Inter,sans-serif">{{ $d['cta']['button_text'] ?? 'Get Started' }} →</button>
</div>

{{-- BENEFITS --}}
<div style="background:{{ $th['sectionBg'] }};padding:80px 40px;text-align:center">
  <div style="font-size:10px;color:{{ $th['mutedText'] }};letter-spacing:.12em;text-transform:uppercase;margin-bottom:12px">WHY IT WORKS</div>
  <h2 style="font-family:'Space Grotesk',sans-serif;font-size:28px;font-weight:700;color:{{ $th['sectionText'] }};margin-bottom:40px;letter-spacing:-.5px">{{ $d['description'] ?? '' }}</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px;max-width:860px;margin:0 auto">
    @foreach($d['benefits'] ?? [] as $benefit)
    <div style="background:{{ $th['cardBg'] }};border:1px solid {{ $th['cardBorder'] }};border-radius:8px;padding:24px;text-align:left">
      <div style="width:20px;height:20px;background:{{ $th['accent'] }};border-radius:4px;margin-bottom:14px"></div>
      <p style="font-size:15px;color:{{ $th['bodyText'] }};line-height:1.6">{{ $benefit }}</p>
    </div>
    @endforeach
  </div>
</div>

{{-- FEATURES --}}
<div style="background:{{ $th['cardBg'] }};padding:80px 40px">
  <div style="max-width:860px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center">
    <div>
      <div style="font-size:10px;color:{{ $th['accent'] }};text-transform:uppercase;letter-spacing:.12em;margin-bottom:12px">Features</div>
      <h2 style="font-family:'Space Grotesk',sans-serif;font-size:26px;font-weight:700;color:{{ $th['sectionText'] }};margin-bottom:24px">Everything you need</h2>
      @foreach($d['features'] ?? [] as $f)
      <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:14px">
        <div style="width:18px;height:18px;border-radius:50%;background:{{ $th['accent'] }};flex-shrink:0;margin-top:2px"></div>
        <div>
          <strong style="font-size:15px;color:{{ $th['sectionText'] }}">{{ $f['title'] }}</strong>
          <p style="font-size:14px;color:{{ $th['bodyText'] }};margin-top:2px">{{ $f['description'] }}</p>
        </div>
      </div>
      @endforeach
    </div>
    <div style="height:220px;border-radius:8px;border:1px solid {{ $th['cardBorder'] }};background:repeating-linear-gradient(45deg,#f5f5f5 0,#f5f5f5 1px,#fafafa 1px,#fafafa 14px);display:flex;align-items:center;justify-content:center">
      <span style="font-size:11px;color:#A0A0A0">product screenshot</span>
    </div>
  </div>
</div>

{{-- TESTIMONIALS --}}
<div style="background:{{ $th['darkBg'] }};padding:80px 40px">
  <div style="max-width:860px;margin:0 auto">
    <div style="font-size:10px;color:{{ $th['accent'] }};text-transform:uppercase;letter-spacing:.12em;margin-bottom:12px;text-align:center">What customers say</div>
    <h2 style="font-family:'Space Grotesk',sans-serif;font-size:26px;font-weight:700;color:{{ $th['darkTitle'] }};text-align:center;margin-bottom:40px">Trusted by closers</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px">
      @foreach($d['testimonials'] ?? [] as $t)
      <div style="background:{{ $th['darkCard'] }};border:1px solid {{ $th['darkBorder'] }};border-radius:8px;padding:24px">
        <p style="font-size:15px;color:{{ $th['darkText'] }};font-style:italic;line-height:1.7;margin-bottom:20px">"{{ $t['quote'] }}"</p>
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:36px;height:36px;border-radius:50%;background:{{ $th['accent'] }};display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:{{ $th['accentText'] }}">{{ strtoupper(substr($t['name'] ?? '?', 0, 1)) }}</div>
          <div>
            <div style="font-size:14px;font-weight:500;color:{{ $th['darkText'] }}">{{ $t['name'] }}</div>
            <div style="font-size:12px;color:{{ $th['mutedText'] }}">{{ $t['role'] }}</div>
          </div>
        </div>
      </div>
      @endforeach
    </div>
  </div>
</div>

{{-- PRICING --}}
<div style="background:{{ $th['pricingBg'] }};padding:80px 40px;text-align:center">
  <div style="font-size:11px;color:{{ $th['mutedText'] }};text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px">Simple pricing</div>
  <div style="font-family:'Space Grotesk',sans-serif;font-size:56px;font-weight:700;color:{{ $th['priceColor'] }};line-height:1">{{ $d['pricing']['price'] ?? '' }}</div>
  <div style="font-size:14px;color:{{ $th['mutedText'] }};margin-top:8px;margin-bottom:36px">{{ $d['pricing']['billing'] ?? '' }}</div>
  <button style="height:50px;padding:0 40px;border-radius:6px;border:none;background:linear-gradient(135deg,{{ $th['accent'] }},{{ $th['accentDark'] }});color:{{ $th['accentText'] }};font-weight:700;font-size:15px;cursor:pointer;font-family:Inter,sans-serif">{{ $d['pricing']['cta_text'] ?? 'Get Started' }}</button>
  @if(!empty($d['pricing']['urgency']))
  <div style="margin-top:16px;font-size:13px;color:{{ $th['urgency'] }}">⚡ {{ $d['pricing']['urgency'] }}</div>
  @endif
</div>

{{-- CTA --}}
<div style="background:{{ $th['heroBg'] }};padding:96px 40px;text-align:center">
  <h2 style="font-family:'Space Grotesk',sans-serif;font-size:40px;font-weight:700;color:{{ $th['heroTitle'] }};max-width:560px;margin:0 auto 36px;line-height:1.15;letter-spacing:-.5px">{{ $d['cta']['supporting_text'] ?? 'Ready to get started?' }}</h2>
  <button style="height:50px;padding:0 36px;border-radius:6px;background:transparent;border:1px solid {{ $th['accent'] }};color:{{ $th['accent'] }};font-weight:600;font-size:15px;cursor:pointer;font-family:Inter,sans-serif">{{ $d['cta']['button_text'] ?? 'Get Started' }}</button>
</div>

</body>
</html>
