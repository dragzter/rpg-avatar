<template>
    <div id="feedback-module">
        <div class="feedback-box p-3 rounded-3 animate__animated animate__flipInY">
            <h2 class="m-0 text-center triple-star-message">
                <div class="wrapper-stars animate__infinite animate__animated animate__pulse">
                    <span class="left-star d-inline-block">⭐</span>
                    <span class="center-star fs-1 d-inline-block">⭐</span>
                    <span class="right-star d-inline-block">⭐</span>
                </div>
            </h2>
            <p class="text-warning d-flex align-items-center">
                <span class="d-inline-block me-3 animate__animated fs-2 animate__wobble animate__infinite">
                    🎁
                </span>
                <span class="d-inline-block">Get 5 tokens for free!</span>
            </p>

            <button class="btn btn-secondary w-100" data-bs-toggle="modal" data-bs-target="#feedback-modal">
                💬 Give Feedback
            </button>
        </div>
    </div>
</template>
