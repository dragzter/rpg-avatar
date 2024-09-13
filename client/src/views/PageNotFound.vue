<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col">
                <div
                    class="d-flex align-items-center justify-content-center"
                    style="min-height: calc(100vh - 202px); height: 100%"
                >
                    <div class="notice-wrapper">
                        <h1 class="text-start title-2 mb-4">
                            PAGE <span>NOT</span> FOUND
                        </h1>
                        <h4 class="mb-4 mx-auto pb-4" style="max-width: 450px">
                            We looked everywhere, we really did! But sadly, this
                            doesn't exist 😵. But don't worry, this happens to
                            everyone, we won't tell 😉.
                        </h4>
                        <router-link class="btn fs-6 btn-secondary" to="/">
                            <i
                                class="fa-sharp fa-solid fa-house-person-return"
                            ></i>
                            Get Back Home
                        </router-link>
                        <h3 class="my-3">OR</h3>
                        <router-link
                            class="btn fs-6 btn-secondary"
                            to="/generate-image"
                        >
                            <i class="fa-sharp fa-regular fa-image"></i>
                            Make Some Pretty Pictures
                        </router-link>
                        <h3 class="my-3">OR</h3>
                        <p>I don't know... click this thing</p>
                        <div class="mt-2 text-start">
                            <button
                                class="btn btn-danger mb-3 story-btn"
                                @click="incrementStory"
                            >
                                DON'T CLICK THIS
                            </button>
                        </div>
                        <div
                            v-if="msgCounter"
                            class="text-start story-time"
                            style="max-width: 450px; min-height: 58px"
                        >
                            <h5>{{ displayedMessage }}</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import {
    BusinessStory,
    ButtonQuestStory,
    MainStory,
    SciFiStory,
    ShortButtonStory,
    SickButtonStory,
} from "@/utils/funny-clicks";

const msgCounter = ref(0);
const sideStoryCounter = ref(0);
const storyBus = ref(MainStory);
const readingSideStory = ref(false);
const displayedMessage = ref(storyBus.value[msgCounter.value]);

// Handler to increment the story index
const incrementStory = () => {
    // Persist the current state before incrementing
    localStorage.setItem("counter", JSON.stringify(msgCounter.value));
    localStorage.setItem("sideCounter", JSON.stringify(sideStoryCounter.value));
    localStorage.setItem(
        "message",
        JSON.stringify(
            storyBus.value[msgCounter.value] ||
                storyBus.value[sideStoryCounter.value]
        )
    );

    if (!readingSideStory.value) {
        // Check if the next message is "INSERT" to switch to a side story
        if (storyBus.value[msgCounter.value] === "INSERT") {
            // Switch to a random side story
            readingSideStory.value = true;
            storyBus.value = getRandomStory([
                BusinessStory,
                SciFiStory,
                ShortButtonStory,
                SickButtonStory,
                ButtonQuestStory,
            ]);
            sideStoryCounter.value = 0;
            displayedMessage.value = storyBus.value[sideStoryCounter.value];
        } else {
            // Regular message in the main story
            displayedMessage.value = storyBus.value[msgCounter.value];
            msgCounter.value++; // Move to the next index
        }
    } else {
        // Handling the side story
        sideStoryCounter.value++;
        if (sideStoryCounter.value >= storyBus.value.length) {
            // If the side story is complete
            readingSideStory.value = false;
            storyBus.value = MainStory; // Switch back to the main story
            msgCounter.value++; // Ensure "INSERT" is skipped in main story
            displayedMessage.value = storyBus.value[msgCounter.value]; // Show the next message after "INSERT"
        } else {
            // Continue the side story
            displayedMessage.value = storyBus.value[sideStoryCounter.value];
        }
    }
};

const getRandomStory = (storyArray) => {
    const randomIndex = Math.floor(Math.random() * storyArray.length);
    return storyArray[randomIndex];
};

// Helper to skip "INSERT" if restored
const skipInsert = () => {
    while (storyBus.value[msgCounter.value] === "INSERT") {
        msgCounter.value++; // Skip the "INSERT" and move to the next message
    }
};

onMounted(() => {
    const storedCounter = localStorage.getItem("counter");
    const savedMessage = localStorage.getItem("message");
    const storedSideCounter = localStorage.getItem("sideCounter");

    if (storedCounter) {
        msgCounter.value = JSON.parse(storedCounter);
    }

    if (storedSideCounter) {
        sideStoryCounter.value = JSON.parse(storedSideCounter);
    }

    if (savedMessage) {
        displayedMessage.value = JSON.parse(savedMessage);
    }

    // After restoring counters, skip "INSERT" if it's the current message
    skipInsert();

    // Set the displayed message after ensuring we skipped "INSERT"
    displayedMessage.value = storyBus.value[msgCounter.value];
});
</script>

<style scoped>
.story-btn {
    @media (max-width: 440px) {
        width: 100% !important;
    }
}

.story-time {
    background: #ffffff;
    border-radius: 6px;
    padding: 8px;
    color: #000;

    h5 {
        font-size: 1.1rem;
        font-weight: 500;
        margin: 0;
    }
}
</style>
