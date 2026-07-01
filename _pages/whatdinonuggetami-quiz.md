---
layout: default
permalink: /whatdinonuggetami/quiz/
---

<style>
  body {
    background: #0d0d1a;
  }

  .masthead,
  .page__footer {
    display: none;
  }

  #main {
    margin: 0;
  }
</style>

<link rel="stylesheet" href="{{ base_path }}/assets/css/whatdinonuggetami.css" />

<div class="whatdino-shell" data-whatdino-app>
  <section class="whatdino-hero">
    <p class="whatdino-badge">✨ Dino Nugget Personality Test</p>
    <h2 class="whatdino-title"><span>Holy Dino Pentagon</span></h2>
    <p class="whatdino-subtitle">Five rounds. No repeats.<br />Find your nugget alignment now. 🔥</p>

    <div class="whatdino-attributes">
      <div class="whatdino-attr whatdino-attr--trex"><span>🦖</span><strong>T Rex</strong></div>
      <span class="whatdino-attr-sep">×</span>
      <div class="whatdino-attr whatdino-attr--triceratops"><span>🛡️</span><strong>Triceratops</strong></div>
      <span class="whatdino-attr-sep">×</span>
      <div class="whatdino-attr whatdino-attr--stegosaurus"><span>🌿</span><strong>Stegosaurus</strong></div>
      <span class="whatdino-attr-sep">×</span>
      <div class="whatdino-attr whatdino-attr--parasaurolophus"><span>🎺</span><strong>Parasaurolophus</strong></div>
      <span class="whatdino-attr-sep">×</span>
      <div class="whatdino-attr whatdino-attr--pterodactylus"><span>🪽</span><strong>Pterodactylus</strong></div>
    </div>

    <div class="whatdino-hero__actions">
      <button class="whatdino-btn whatdino-btn--primary" type="button" data-action="start">Los geht's 🚀</button>
      <button class="whatdino-btn whatdino-btn--ghost" type="button" data-action="resume" hidden>Resume run</button>
    </div>
    <p class="whatdino-meta"><span data-pool-count>0</span> random prompts in archive • 5 questions per run</p>
  </section>

  <section class="whatdino-stage is-hidden" aria-live="polite" data-stage>
    <div class="whatdino-stage__header">
      <div>
        <p class="whatdino-stage__eyebrow" data-question-category>Ready when you are</p>
        <h3 class="whatdino-question" data-question-text>Start the round to get your first question.</h3>
      </div>
      <div class="whatdino-progress">
        <div class="whatdino-progress__bar"><span class="whatdino-progress__fill" data-progress-fill></span></div>
        <p class="whatdino-progress__text"><span data-round-index>0</span> of 5 answered</p>
      </div>
    </div>
    <div class="whatdino-options" data-options></div>
    <p class="whatdino-status" data-status>5 random questions. No repeats in your local archive.</p>
  </section>

  <section class="whatdino-result is-hidden" data-result-region>
    <div class="whatdino-result__card">
      <p class="whatdino-result__eyebrow">Your final nugget</p>
      <h3 class="whatdino-result__name" data-result-name>T Rex Nugget</h3>
      <p class="whatdino-result__copy" data-result-copy></p>

      <div class="whatdino-pentagram" data-pentagram>
        <svg class="whatdino-pentagram__lines" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
          <polygon points="50,6 93,38 76,90 24,90 7,38" />
          <polyline points="50,6 76,90 7,38 93,38 24,90 50,6" />
        </svg>
        <button class="whatdino-node whatdino-node--trex" type="button" data-dino-node="trex" disabled><span>🦖</span><strong>T Rex</strong></button>
        <button class="whatdino-node whatdino-node--triceratops" type="button" data-dino-node="triceratops" disabled><span>🛡️</span><strong>Triceratops</strong></button>
        <button class="whatdino-node whatdino-node--stegosaurus" type="button" data-dino-node="stegosaurus" disabled><span>🌿</span><strong>Stegosaurus</strong></button>
        <button class="whatdino-node whatdino-node--parasaurolophus" type="button" data-dino-node="parasaurolophus" disabled><span>🎺</span><strong>Parasaurolophus</strong></button>
        <button class="whatdino-node whatdino-node--pterodactylus" type="button" data-dino-node="pterodactylus" disabled><span>🪽</span><strong>Pterodactylus</strong></button>
        <span class="whatdino-pentagram__marker" data-marker></span>
      </div>

      <div class="whatdino-result__stats">
        <div><span>Run progress</span><strong data-game-count>0 / 5</strong></div>
        <div><span>Result label</span><strong data-result-pill>Pending</strong></div>
      </div>

      <div class="whatdino-result__actions">
        <button class="whatdino-btn whatdino-btn--primary" type="button" data-action="download">Download image</button>
        <button class="whatdino-btn whatdino-btn--ghost" type="button" data-action="share">Share image</button>
        <button class="whatdino-btn whatdino-btn--ghost" type="button" data-action="play-again">Play again</button>
      </div>
    </div>
  </section>
</div>

<script src="{{ base_path }}/assets/js/whatdinonuggetami.js"></script>