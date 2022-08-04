<template>
    <v-container fluid style="height:100%">
        <v-snackbar
        :timeout="3000"
        :value="snack"
        absolute
        top
        :color="scolor"
        outlined
        center
        >
            {{stext}}
        </v-snackbar>
        <v-row align="center" justify="space-around" style="height:100%">
            <v-card class="ma-10 rounded-xl" color="white" elevation="7" max-width="1200px">
                <v-row>
                    <v-col md="12" xs="12" justify="space-around" align="center">
                        <v-img max-width="300" :src="require('../assets/y2l_logo.png')"></v-img>
                    </v-col>
                    <v-col class="px-10 pb-10" md="12" xs="12" align="center" max-width="800px">
                        <v-card class="rounded-xl" v-if="!reg" elevation="10" color="#761287">
                            <v-card-title>Login</v-card-title>
                            <v-card-text>
                                <v-text-field prepend-inner-icon="mdi-email" v-model="email" :rules="emailRules" label="Email" ></v-text-field>
                                <v-text-field prepend-inner-icon="mdi-lock" v-model="password" type="password" label="Password"></v-text-field>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn rounded :loading="loading" @click="login" color="#3406ad">Login</v-btn>
                                <v-spacer></v-spacer>
                                <v-btn text @click="reg = !reg" color="green">Go to Signup</v-btn>
                            </v-card-actions>
                        </v-card>
                        <v-card v-else class="rounded-xl" color="#761287" elevation="10" max-width="800px">
                            <v-form ref="signup" v-model="valid">
                                <v-card-title>Signup</v-card-title>
                                <v-card-text>
                                    <v-text-field prepend-inner-icon="mdi-account" v-model="name" :rules="[v => !!v || 'Name is required']" label="Name" ></v-text-field>
                                    <v-text-field prepend-inner-icon="mdi-email" v-model="email" :rules="emailRules" label="Email" ></v-text-field>
                                    <v-text-field prepend-inner-icon="mdi-phone" v-model="phone" :rules="phoneRules" label="Mobile No." ></v-text-field>
                                    <v-text-field prepend-inner-icon="mdi-lock" v-model="password" type="password" label="Password"></v-text-field>
                                    <v-text-field prepend-inner-icon="mdi-lock" v-model="rpassword" :rules="passMatch" type="password" label="Repeat Password"></v-text-field>
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn :loading="loading" rounded :disabled="!valid" @click="signup" color="#3406ad">Submit</v-btn>
                                    <v-spacer></v-spacer>
                                    <v-btn text @click="reg = !reg" color="green">Go to Login</v-btn>
                                </v-card-actions>
                            </v-form>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card>
        </v-row>
    </v-container>
</template>

<script>
// import {supabase} from '../supabase'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
export default {
    data: () => ({
        reg: false,
        valid: true,
        name: '',
        email: '',
        phone: '',
        phoneRules: [
            v => !!v || 'Phone number is required',
            v => /^[6-9]{1}[0-9]{9}$/.test(v) || 'Enter valid phone number',
        ],
        emailRules: [
            v => !!v || 'E-mail is required',
            v => /.+@.+\..+/.test(v) || 'Enter valid email address',
        ],
        password: '',
        rpassword: '',
        loading: false,
        snack: false,
        scolor: '',
        stext: ''
    }),

    methods: {
        // login() {
        //     this.loading = true
        //     supabase.auth.signIn({
        //         email: this.email,
        //         password: this.password,
        //     })
        //     .then(() => {
        //         this.snack = true
        //         this.scolor = 'success'
        //         this.stext = 'Logged in!'
        //     })
        //     .catch((err) => {
        //         this.snack = true
        //         this.scolor = 'error'
        //         this.stext = err.message
        //     })
        //     this.loading = false
        // },
        login() {
            this.loading = true
            firebase.auth().signInWithEmailAndPassword(this.email, this.password)
            .then(() => {
                this.snack = true
                this.scolor = 'success'
                this.stext = 'Logged in!'
            })
            .catch((err) => {
                this.snack = true
                this.scolor = 'error'
                this.stext = err.message
            })
            this.loading = false
        },
        // async signup() {
        //     this.loading = true
        //     supabase.auth.signUp(
        //         {
        //             email: this.email,
        //             password: this.password,
        //         },
        //         {
        //         data: {
        //             name: this.name,
        //             phone: this.phone,
        //         }
        //     }).then( (data) => {
        //         if(data.user) {
        //             this.snack = true
        //             this.scolor = 'success'
        //             this.stext = 'Account created successfully!'
        //         }
        //         if(data.error) {
        //             this.snack = true
        //             this.scolor = 'error'
        //             this.stext = data.error.message
        //         }
        //         this.loading = true
        //     } )
        // }
        signup() {
            this.loading = true
            firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
            .then((snap) => {
                firebase.database().ref('users/'+snap.user.uid).set({
                    name: this.name,
                    phone: this.phone,
                    email: this.email,
                    address: ''
                })
                .then(() => {
                    this.snack = true
                    this.scolor = 'success'
                    this.stext = 'Account created successfully!'
                })
            })
            .catch((err) => {
                this.snack = true
                this.scolor = 'error'
                this.stext = err.message
            })
        }
    },

    computed: {
        passMatch () {
            return [v => (!!v && v) === this.password ||'Values do not match']
        }
    }
}
</script>

<style scoped>
    body {
        background-color: black;
    }
</style>