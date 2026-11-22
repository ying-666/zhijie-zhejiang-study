<script setup lang="ts">
import { activeSubjects, subjectUrl } from '../../data/catalog.ts'
</script>

<template>
  <div class="subject-grid">
    <a v-for="subject in activeSubjects" :key="subject.id" :href="subjectUrl(subject.id)" class="subject-card">
      <span class="subject-icon" :class="subject.id">{{ subject.mark }}</span>
      <span class="subject-body"><strong>{{ subject.name }}</strong>
        <span>{{ subject.focus || subject.modules.slice(0, 2).join(' · ') }}</span>
      </span>
    </a>
  </div>
</template>
