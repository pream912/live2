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
                                <v-text-field outlined v-model="user.stname" :rules="[v => !!v || 'Name is required']" label="Studio name" ></v-text-field>
                                <v-text-field outlined v-model="user.email" readonly label="Email" ></v-text-field>
                                <v-text-field outlined v-model="user.phone" :rules="phoneRules" label="Mobile No." ></v-text-field>
                                <v-textarea outlined v-model="user.address" label="Address"></v-textarea>
                                <v-img :src="user.logo" max-width="200" contain></v-img>
                                <v-file-input v-model="logo" :rules="rules" accept="image/png, image/jpeg, image/bmp" show-size label="LOGO (50kb max)"></v-file-input>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn :loading="loading" @click="uploadImg" color="primary">Update</v-btn>
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
        stname: '',
        logo: null,
        phoneRules: [
            v => !!v || 'Phone number is required',
            v => /^[6-9]{1}[0-9]{9}$/.test(v) || 'Enter valid phone number',
        ],
        rules: [
            value => !value || value.size < 200000 || 'Image size should be less than 200 KB!',
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
        },

        async uploadImg() {
            this.loading = true
            const uid = firebase.auth().currentUser.uid
            if(this.logo != null) {
                firebase.storage().ref(`logos/${uid}/logo`).put(this.logo)
                .then((fileData) => {
                    return firebase.storage().ref(fileData.metadata.fullPath).getDownloadURL()  
                })
                .then((url) => {
                    this.user.logo = url
                    this.update()
                })
            }
            else {
                this.update()
            }
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