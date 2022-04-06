<template>
    <v-container>
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
        <v-row class="ma-10">
            <v-col align="center" cols="12">
                <v-card v-if="!reg" elevation="10" max-width="800px">
                    <v-card-title>Login</v-card-title>
                    <v-card-text>
                        <v-text-field v-model="email" :rules="emailRules" label="Email" ></v-text-field>
                        <v-text-field v-model="password" type="password" label="Password"></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn :loading="loading" @click="login" color="primary">Login</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn text @click="reg = !reg" color="green">Signup</v-btn>
                    </v-card-actions>
                </v-card>
                <v-card v-else elevation="10" max-width="800px">
                    <v-form ref="signup" v-model="valid">
                        <v-card-title>Signup</v-card-title>
                        <v-card-text>
                            <v-text-field v-model="name" :rules="[v => !!v || 'Name is required']" label="Name" ></v-text-field>
                            <v-text-field v-model="email" :rules="emailRules" label="Email" ></v-text-field>
                            <v-text-field v-model="phone" :rules="phoneRules" label="Mobile No." ></v-text-field>
                            <v-text-field v-model="password" type="password" label="Password"></v-text-field>
                            <v-text-field v-model="rpassword" :rules="passMatch" type="password" label="Repeat Password"></v-text-field>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn :loading="loading" :disabled="!valid" @click="signup" color="primary">Submit</v-btn>
                            <v-spacer></v-spacer>
                            <v-btn text @click="reg = !reg" color="green">Login</v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
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