<template>
    <div id="feedback-modal-component">
        <modal-component id="feedback-modal" modal-title="Feedback" size="sm">
            <div class="modal-body-wrapper">
                <div class="form-group mb-3">
                    <!-- click on a star 1 through 5 -->
                    <div class="d-flex justify-content-center">
                        <div class="w-100">
                            <h5 class="text-center fw-bold">How would you rate this feature?</h5>
                            <div class="d-flex align-items-center justify-content-between">
                                <span
                                    v-for="star in 5"
                                    @click="stars = star"
                                    class="fs-2 rating-star"
                                    style="cursor: pointer"
                                    :class="{ 'is-active': star <= stars }"
                                >
                                    ⭐
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="feedback">Comments</label>
                    <textarea
                        v-model="feedback"
                        class="form-control"
                        id="feedback"
                        rows="3"
                        :maxlength="feedbackMaxLength"
                        placeholder="Enter your feedback here"
                    ></textarea>
                    <small
                        :class="{
                            'text-danger': feedback.length < feedbackMinLength,
                            'text-success': feedback.length >= feedbackMinLength,
                        }"
                    >
                        {{ feedback.length }} / {{ feedbackMinLength }}
                    </small>
                </div>
            </div>
            <template #footer>
                <button
                    @click="submitFeedback"
                    :disabled="stars === 0 || !feedback || feedback.length < feedbackMinLength"
                    class="btn w-100 btn-primary"
                >
                    <i class="fa-solid fa-paper-plane"></i> Submit
                </button>
            </template>
        </modal-component>

        <ToastComponent
            :autoClose="true"
            :autoCloseDelay="4000"
            :isError="feedback.length < feedbackMinLength"
            :message="toastMessage"
            :show="showToast"
        />
    </div>
</template>

<script setup>
import ModalComponent from "@/components/global/ModalComponent.vue";
import { onMounted, ref } from "vue";
import { useUserStore } from "@/stores/user";
import { sanitize } from "@/utils/text-utils";
import ToastComponent from "@/components/global/ToastComponent.vue";
import { Modal } from "bootstrap";

const props = defineProps({
    userId: String,
    feedback_key: String,
});

const emit = defineEmits(["feedback-submitted"]);

const feedbackMinLength = 20;
const feedbackMaxLength = 500;
const showToast = ref(false);
const toastMessage = ref("");
const modalInstance = ref(null);

const feedback = ref("");
const stars = ref(0);
const userStore = useUserStore();

const submitFeedback = async () => {
    feedback.value = sanitize(feedback.value);

    if (feedback.value.length < feedbackMinLength) {
        showToast.value = true;
        toastMessage.value = "Feedback must be at least 20 characters long";

        setTimeout(() => {
            showToast.value = false;
        }, 4000);

        return;
    }

    await userStore.submitFeedback({
        user_id: props.userId,
        feedback: feedback.value,
        stars: stars.value,
        feedback_key: props.feedback_key,
    });

    feedback.value = "";
    stars.value = 0;

    emit("feedback-submitted");

    modalInstance.value.hide();
};

onMounted(() => {
    const modalElement = document.getElementById("feedback-modal");
    if (modalElement) {
        // @ts-ignore
        modalInstance.value = Modal.getInstance(modalElement) || new Modal(modalElement);
    }
});
</script>
