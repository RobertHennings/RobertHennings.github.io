---
layout: single
title: "What Dino Nugget Am I?"
permalink: /whatdinonuggetami/
author_profile: false
comments: false
share: false
---

<link rel="stylesheet" href="{{ base_path }}/assets/css/whatdinonuggetami.css" />

<div class="whatdino-shell" data-whatdino-app>
  <section class="whatdino-hero">
    <div class="whatdino-copy">
      <p class="whatdino-kicker">5 rounds. no repeats. one nugget destiny.</p>
      <h2 class="whatdino-title">Find your dino nugget quadrant.</h2>
      <p class="whatdino-lede">Answer five randomized questions. Each run pulls a fresh mix from a rotating archive and tracks your history in the browser so the same question set does not repeat in the same session or browser until the archive is exhausted.</p>
    </div>

    <div class="whatdino-hero__card">
      <div class="whatdino-hero__stat">
        <span>Current run</span>
        <strong data-game-count>0 / 5</strong>
      </div>
      <div class="whatdino-hero__stat">
        <span>Question pool</span>
        <strong data-pool-count>0</strong>
      </div>
      <div class="whatdino-hero__stat">
        <span>Result</span>
        <strong data-result-pill>Pending</strong>
      </div>
      <div class="whatdino-hero__actions">
        <button class="whatdino-btn whatdino-btn--primary" type="button" data-action="start">Start a new trail</button>
        <button class="whatdino-btn whatdino-btn--ghost" type="button" data-action="resume" hidden>Resume current trail</button>
      </div>
    </div>
  </section>

  <section class="whatdino-stage" aria-live="polite">
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
    <p class="whatdino-status" data-status>Five questions. Zero repeats. One result.</p>
  </section>

  <section class="whatdino-result is-hidden" data-result-region>
    <div class="whatdino-result__card">
      <p class="whatdino-result__eyebrow">Your final nugget</p>
      <h3 class="whatdino-result__name" data-result-name>Cozy Crunch Stego Nugget</h3>
      <p class="whatdino-result__copy" data-result-copy></p>

      <div class="whatdino-quadrant" data-quadrant>
        <div class="whatdino-quadrant__corner whatdino-quadrant__corner--nw">Cozy Crunch<br><strong>Stego</strong></div>
        <div class="whatdino-quadrant__corner whatdino-quadrant__corner--ne">Wild Crunch<br><strong>Rex</strong></div>
        <div class="whatdino-quadrant__corner whatdino-quadrant__corner--sw">Cozy Saucy<br><strong>Trike</strong></div>
        <div class="whatdino-quadrant__corner whatdino-quadrant__corner--se">Wild Saucy<br><strong>Raptor</strong></div>
        <div class="whatdino-quadrant__axis whatdino-quadrant__axis--x">Cozy to Wild</div>
        <div class="whatdino-quadrant__axis whatdino-quadrant__axis--y">Crunchy to Saucy</div>
        <span class="whatdino-quadrant__marker" data-marker></span>
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
