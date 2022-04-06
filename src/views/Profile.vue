<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title>
                        User profile
                    </v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field outlined v-model="user.name" :rules="[v => !!v || 'Name is required']" label="Name" ></v-text-field>
                                <v-text-field outlined v-model="user.email" readonly label="Email" ></v-text-field>
                                <v-text-field outlined v-model="user.phone" :rules="phoneRules" label="Mobile No." ></v-text-field>
                                <v-textarea outlined v-model="user.address" label="Address"></v-textarea>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn :loading="loading" @click="update" color="primary">Update</v-btn>
                    </v-card-actions>
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
    data:() => ({
        name: '',
        email: '',
        phone: '',
        address: '',
        phoneRules: [
            v => !!v || 'Phone number is required',
            v => /^[6-9]{1}[0-9]{9}$/.test(v) || 'Enter valid phone number',
        ],
        loading: false
    }),

    methods: {
        update () {
            this.loading = true
            const uid = firebase.auth().currentUser.uid
            firebase.database().ref('users/'+uid).update(this.user)
            .then(() => {
                this.$store.dispatch('getProfile', uid)
                this.$store.dispatch('createAlert',{type: 'success', message: 'Profile updated'})
                this.setData()
                this.loading = false
            })
            .catch((err) => {
                this.$store.dispatch('createAlert',{type: 'error', message: err.message})
                this.loading = false
            })
        },

        setData () {
            this.name = this.user.name
            this.email = this.user.email
            this.phone = this.user.phone
            this.address = this.user.address
        }
    },

    computed: {
        user () {
            return this.$store.getters.userProfile
        }
    },

    mounted () {
        this.setData()
    }
}
</script>