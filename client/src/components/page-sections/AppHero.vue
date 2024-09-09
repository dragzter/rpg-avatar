<template>
  <section id="app-hero" class="waves-1_bg">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-6">
          <div id="intro" class="m-auto my-5">
            <h1 class="fw-bolder pe-md-5">
              Effortlessly Create Unique RPG Avatars
            </h1>
            <p class="fs-5 my-4 pe-md-5">
              Our AI-driven generator makes it easy to design
              personalized RPG avatars. With just a few clicks,
              bring your fantasy character to life in vivid
              detail.
            </p>
            <router-link
                class="btn btn-lg me-3 fw-normal btn-primary"
                to="generate-image"
            >GET STARTED
            </router-link>
            <router-link
                class="btn btn-lg fw-normal btn-info btn-special"
                to="generate-image"
            >LEARN MORE
            </router-link>
          </div>
        </div>
        <div class="col-md-6 text-center">
          <div class="accent-frame" style="transform: rotate(3deg)">
            <div>
              <img
                  alt=""
                  class="img-fluid"
                  src="/assets/rogue-24-female.png"
                  style="border-radius: 10px"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="cta-1">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="ready-section">
            <h2 class="title-2">Ready to <span>Begin?</span></h2>
            <p class="mb-5" style="max-width: 700px;margin: auto;">
              Be it content creation, game design, story telling. Ai art can get help to tell your story in a
              visual way. Your only limitation is your creativity. Create some magnificent AI
              Art and bring your story to life.
            </p>
            <router-link class="btn btn-primary" to="generate-image">Get Started</router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup></script>
