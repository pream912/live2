<template>
    <v-container>
        <v-row class="ma-10">
            <v-col align="center" cols="12">
                <v-card elevation="10" max-width="800px">
                    <v-card-title>Login</v-card-title>
                    <v-card-text>
                        <v-text-field v-model="email" label="Email" ></v-text-field>
                        <v-text-field v-model="password" type="password" label="Password"></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn :loading="loading" @click="login" color="primary">Login</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'
export default {
    data: () => ({
        email: '',
        password: '',
        loading: false
    }),

    methods: {
        async login() {
            this.loading = true
            await firebase.auth().signInWithEmailAndPassword(this.email, this.password)
            this.loading = false
        }
    }
}
</script>