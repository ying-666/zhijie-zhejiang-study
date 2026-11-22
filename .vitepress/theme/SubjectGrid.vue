<script setup lang="ts">
import { subjectUrl, subjects } from '../../data/catalog.ts'
</script>

<template>
  <div class="subject-grid">
    <a v-for="subject in subjects" :key="subject.id" :href="subjectUrl(subject.id)" class="subject-card">
      <span class="subject-icon" :class="subject.id" aria-hidden="true">{{ subject.mark }}</span>
      <span class="subject-body"><strong>高中{{ subject.name }}</strong><span>{{ subject.focus }}</span></span>
    </a>
  </div>
</template>
