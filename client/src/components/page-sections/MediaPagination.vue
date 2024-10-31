<template>
    <nav aria-label="Page navigation" class="py-3 rpg-pagination">
        <ul class="pagination justify-content-center">
            <!-- Previous button -->
            <li :class="{ disabled: currentPage === 1 }" class="page-item">
                <button class="page-link" @click="changePage(currentPage - 1)">
                    <span class="accent-text"><i class="fa-solid fa-arrow-left"></i> Previous </span>
                </button>
            </li>

            <!-- Page selection dropdown -->
            <li class="page-item dropdown">
                <button
                    id="pageDropdown"
                    aria-expanded="false"
                    class="page-link dropdown-toggle"
                    data-bs-toggle="dropdown"
                    type="button"
                >
                    Page {{ currentPage }}
                </button>
                <ul aria-labelledby="pageDropdown" class="dropdown-menu">
                    <li v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
                        <button class="dropdown-item" @click="changePage(page)">
                            {{ page }}
                        </button>
                    </li>
                </ul>
            </li>

            <!-- Next button -->
            <li :class="{ disabled: currentPage === totalPages }" class="page-item">
                <button class="page-link" @click="changePage(currentPage + 1)">
                    <span class="accent-text">Next <i class="fa-solid fa-arrow-right"></i></span>
                </button>
            </li>
        </ul>
    </nav>
</template>
<script lang="ts" setup>
const props = defineProps<{
    currentPage: number;
    totalPages: number;
    changePage: (page: number) => void;
}>();
</script>
