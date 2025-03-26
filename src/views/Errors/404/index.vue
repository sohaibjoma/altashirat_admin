<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" md="8" lg="6" class="text-center">

        <Image
          name="404error.png"/>
        <!-- Title -->
        <h1 class=" font-weight-bold mb-4">
          {{ $t('error404.title') }}
        </h1>

        <!-- Description -->
        <p class="text--secondary mb-8">
          {{ $t('error404.description') }}
        </p>

        <!-- Home Button -->
        <MainButton
          color="primary"
          x-large
          depressed
          class="text-none"
          to="/"
        >
          <v-icon left>mdi-home</v-icon>
          {{ $t('error404.homeButton') }}
        </MainButton>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Error404',
}
</script>