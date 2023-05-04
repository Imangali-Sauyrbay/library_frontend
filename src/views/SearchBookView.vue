<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import LibraryService, { type BookResponce, type BookMap, type Hit } from '@/services/LibraryService'
import {
    ElButton,
    ElInput,
    ElIcon,
    ElContainer,
    ElDivider,
    ElImage
} from 'element-plus'
import { Search, TopRight } from '@element-plus/icons-vue'
import debounce from '@/utils/Debounce'
import HighlightText from '@/components/library/HighlightText.vue'
import { openMapApp } from '@/utils/CommonUtils'

const service = new LibraryService()
const searchText = ref('')
const lastResult = ref<BookResponce>()
const books = ref<BookMap>({})
const pages = ref<Hit[]>([])

const loading = ref(false)
const noMore = computed(() => lastResult.value?.totalPages === lastResult.value?.page)
const disabled = computed(() => loading.value || noMore.value)

let page = 1
const load = async () => {
    if(lastResult.value && lastResult.value?.totalPages < page) return

    loading.value = true
    const res = await service.getBook<BookResponce>(searchText.value, page)

    lastResult.value = res.data

    books.value = {
        ...books.value,
        ...res.data.books
    }

    pages.value = [
        ...pages.value,
        ...res.data.hits
    ]

    loading.value = false
    page++
}
const loadData = debounce(() => {
    page = 0
    books.value = {}
    pages.value = []
    
    load()
}, 500)

watch(searchText, loadData)
onMounted(load)
</script>

<template>
  <div class="infinite-list-wrapper" style="overflow: auto">
    <el-input
      v-model="searchText"
      placeholder="Please input"
      class="input-with-select"
    >
      <template #append>
        <el-button :icon="Search" />
      </template>
    </el-input>

    <ul
      v-infinite-scroll="load"
      class="list"
      :infinite-scroll-disabled="disabled"
    >
    <template v-for="page in pages" :key="page.page + page.matches.content.length">
      <ElContainer class="container" v-for="match in page.matches.content" :key="match.match">
        <div class="main">
        <el-image style="min-width: 150px; height: 200px" :src="service.getBookCoverUrl(page.book_slug)" fit="contain" />
        <h2>Title: {{ books[page.book_slug].title }}</h2>
        <p>Authors: {{ books[page.book_slug].authors }}</p>
        <p>Country: {{ books[page.book_slug].country }}</p>
        <p>Language: {{ books[page.book_slug].lang }}</p>
        <p>Year: {{ books[page.book_slug].released }}</p>
        <p>Left: {{ books[page.book_slug].quantity }}</p>
        <p>Description: {{ books[page.book_slug].description }}</p>
        <p>Address: {{ books[page.book_slug].bookable?.address.displayName }}</p>
        <el-button type="primary" plain round @click="openMapApp(books[page.book_slug].bookable?.address.lat || 0, books[page.book_slug].bookable?.address.lng || 0)">
        To Map<el-icon class="el-icon--right"><TopRight /></el-icon>
        </el-button>
        </div>
        <div class="pages">
            <li class="list-item">
                <ElDivider>
                <strong>Page: {{ page.page }}</strong>
                </ElDivider>
                <HighlightText :text="match.text" :phrase="match.match"/>      
            </li>
            <ElDivider />
        </div>
    </ElContainer>
    </template>
    </ul>
    <p v-if="loading">Loading...</p>
    <p v-if="noMore">No more</p>
  </div>
</template>

<style scoped lang="scss">
@import '@/main.scss';

.infinite-list-wrapper {
    padding: 2rem;
    height: 100%;
    text-align: center;
}

.infinite-list-wrapper .list {
    padding: 0;
    margin: 0;
    list-style: none;
}

.infinite-list-wrapper .list-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: fit-content;    
}

.infinite-list-wrapper .list-item + .list-item {
    margin-top: 10px;
}

.main {
    width: 100%;
}

.pages {
    width: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    margin: 20px auto 0;
    box-shadow: 0 0 5px 0 black;
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
    gap: 15px;
}

@include breakpoint('md') {
    .container {
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    .main {
        width: 50%;
    }
}
</style>

<style>

.pages .el-divider {
    border-width: 3px;
}

</style>