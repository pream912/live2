<template>
    <v-container>
        <v-row class="pa-3">
            <v-btn color="primary" @click="newEvent">Create Event</v-btn>
            <v-dialog v-model="dialog"
            persistent
            max-width="750px">
                <v-card>
                    <v-card-title>New Event</v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row lazy-validation>
                                <v-col cols="12">
                                    <v-text-field required v-model="ename" label="Event name"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-textarea required v-model="edescription" label="Event description"></v-textarea>
                                </v-col>
                                <v-col cols="6">
                                    <v-menu
                                        v-model="fmenu"
                                        :close-on-content-click="false"
                                        :nudge-right="40"
                                        transition="scale-transition"
                                        offset-y
                                        min-width="290px"
                                    >
                                        <template v-slot:activator="{ on, attrs }">
                                        <v-text-field 
                                        v-model="efrom"
                                        label="From"
                                        v-bind="attrs"
                                        v-on="on"
                                        readonly
                                        ></v-text-field>
                                        </template>
                                        <v-date-picker v-model="efrom" :max="max" :min="min"></v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col cols="6">
                                    <v-menu
                                        v-model="tmenu"
                                        :close-on-content-click="false"
                                        :nudge-right="40"
                                        transition="scale-transition"
                                        offset-y
                                        min-width="290px"
                                    >
                                        <template v-slot:activator="{ on }">
                                        <v-text-field 
                                        v-model="eto"
                                        label="To"
                                        v-on="on"
                                        
                                        readonly
                                        ></v-text-field>
                                        </template>
                                        <v-date-picker v-model="eto" :max="max" :min="min"></v-date-picker>
                                    </v-menu>
                                </v-col>
                                <!-- <v-col cols="6">
                                    <v-file-input v-model="top" :rules="rules" accept="image/png, image/jpeg, image/bmp" show-size label="Top image (200kb max)"></v-file-input>
                                </v-col>
                                <v-col cols="6">
                                    <v-file-input v-model="bottom" :rules="rules" accept="image/png, image/jpeg, image/bmp" show-size label="Bottom image (200kb max)"></v-file-input>
                                </v-col> -->
                                <v-col cols="6">
                                    <v-text-field :rules="sdrules" v-model="sdomain" label="URL"></v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <h4>.you2live.com</h4>
                                </v-col>
                                <v-col cols="6">
                                    <v-checkbox disabled v-model="recording" label="Recording"></v-checkbox>
                                </v-col>
                                <v-col cols="6">
                                    <v-select v-model="sduration" :disabled="!recording" label="Storage duration" :items="sdays"></v-select>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn :loading="loading" @click="createEvent" rounded color="green">Create</v-btn>
                        <v-btn @click="close" rounded color="red">Cancel</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-data-table
                :headers="headers"
                :items="events">
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-icon
                            small
                            color="orange"
                            class="mr-2"
                            @click="openEvent(item)"
                        >
                            mdi-wrench
                        </v-icon>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
        <v-row>
            <v-dialog 
            v-model="dialog1" 
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition">
                <v-card>
                    <v-toolbar>
                        <h3 class="pl-3">{{ename}}</h3>
                        <v-btn @click="startServer" class="ml-5" color="primary" v-if="evenT.status == 'Inactive'">Start server</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn  @click="dialog1 = false" small icon>
                            <v-icon class="red--text">mdi-close</v-icon>
                        </v-btn>
                    </v-toolbar>
                    <v-card-text>
                        <v-container>
                            <v-row v-if="evenT.status == 'Active'">
                                <table>
                                    <tr>
                                        <td>Uplink:</td>
                                        <td class="pa-3">rtmp://{{sdomain}}.avmediawork.in:{{port}}/live</td>
                                    </tr>
                                    <tr>
                                        <td>Stream link:</td>
                                        <td class="pa-3">https://{{sdomain}}.you2live.com</td>
                                    </tr>
                                    <tr>
                                        <td>Stream key:</td>
                                        <td class="pa-3">{{streamkey}}</td>
                                    </tr>
                                </table>
                            </v-row>
                            <v-divider></v-divider>
                            <v-row>
                                <v-col cols="6">
                                    <v-file-input v-model="top" :rules="rules" accept="image/png, image/jpeg, image/bmp" show-size label="Top image (200kb max)"></v-file-input>
                                </v-col>
                                <v-col cols="6">
                                    <v-file-input v-model="bottom" :rules="rules" accept="image/png, image/jpeg, image/bmp" show-size label="Bottom image (200kb max)"></v-file-input>
                                </v-col>
                                <v-divider></v-divider>
                                <v-col cols="12">
                                    <v-btn :loading="uploading" @click="uploadImg" color="primary">Update</v-btn>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-row>
        <v-row>
            <v-snackbar
            v-model="snackbar"
            timeout="2000"
            :color="scolor"
            centered
            outlined
            top>
                {{snack}}
            </v-snackbar>
        </v-row>
    </v-container>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/database'
import 'firebase/auth'
import axios from 'axios'
    export default {
        data: () => ({
            snackbar: false,
            port: '',
            snack: '',
            scolor: '',
            dialog: false,
            dialog1: false,
            sdomain: '',
            streamkey: '',
            sdrules: [
                v => !!v || 'Value is required',
                v => /^[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]$/.test(v) || 'Invalid value',
            ],
            headers: [
                {text: 'Event name', value: 'ename'},
                {text: 'Event Date', value: 'efrom'},
                {text: 'Status', value: 'status'},
                { text: 'Actions', value: 'actions'},
            ],
            rules: [
                value => !value || value.size < 200000 || 'Image size should be less than 200 KB!',
            ],
            sdays: ['30days', '60days', '90days'],
            ename: '',
            edescription: '',
            efrom: null,
            eto: null,
            top: null,
            bottom: null,
            recording: false,
            sduration: '',
            fmenu: false,
            tmenu: false,
            loading: false,
            uploading: false,
            responce: {},
            evenT: {} 
        }),
        methods: {
            newEvent() {
                this.dialog = true
            },
            close() {
                this.dialog = false
                this.ename = ''
                this.edescription = ''
                this.efrom = null
                this.eto = null
                this.sduration = ''
                this.recording = false
                this.loading = false
            },
            startServer () {
                let payload = JSON.stringify({name: this.evenT.sdomain, type: 'basic-server'})
                axios.post('https://apis.avmediawork.in/create', payload, {
                    headers: {'Content-Type': 'application/json'}
                })
                .then((responce) => {
                    this.responce = responce.data
                    this.port = responce.data.spec.ports[0].nodePort
                    var url = `https://hls-${this.evenT.sdomain}.avmediawork.in/live/${this.evenT.streamkey}/index.m3u8`
                    firebase.database().ref(`streams/${this.evenT.sdomain}`).set({url:url})
                    firebase.database().ref(`events/${this.uid}/${this.evenT.eid}`).update({status: 'Active'})
                    .then(() => this.evenT.status = 'Active')
                })
                .catch((err) => {
                    console.log(err.message)
                })
            },
            async createEvent() {
                var rString = this.randomString(7, '0123456789abcdefghijklmnopqrstuvwxyz');
                this.loading = true
                var event = {
                    ename: this.ename,
                    edescription: this.edescription,
                    efrom: this.efrom,
                    eto: this.eto,
                    sdomain: this.sdomain,
                    recording: this.recording,
                    sduration: this.sduration,
                    streamkey: rString,
                    status: 'Inactive'
                }
                //var url = `https://${this.sdomain}.you2live.com/live/${rString}/index.m3u8`
                await firebase.database().ref(`events/${this.uid}`).push(event)
                //await firebase.database().ref(`streams/${this.sdomain}`).set({url:url})
                this.$store.dispatch('getEvents', this.uid)
                this.$store.dispatch('createAlert',{type: 'success', message: 'Event created'})
                this.close()                
            },

            async uploadImg() {
                if(this.top != null) {
                    this.uploading = true
                    firebase.storage().ref(`images/${this.sdomain}/top`).put(this.top)
                    .then((fileData) => {
                        return firebase.storage().ref(fileData.metadata.fullPath).getDownloadURL()  
                    })
                    .then((url) => {
                        firebase.database().ref(`streams/${this.sdomain}/top`).set(url)
                        this.snackbar = true
                        this.snack = 'Top image uploaded'
                        this.scolor = 'success'
                        this.uploading = false
                    })
                }

                if(this.bottom != null) {
                    this.uploading = true
                    firebase.storage().ref(`images/${this.sdomain}/bottom`).put(this.bottom)
                    .then((fileData) => {
                        return firebase.storage().ref(fileData.metadata.fullPath).getDownloadURL()  
                    })
                    .then((url) => {
                        firebase.database().ref(`streams/${this.sdomain}/bottom`).set(url)
                        this.snackbar = true
                        this.snack = 'Bottom image uploaded'
                        this.scolor = 'success'
                        this.uploading = false
                    })
                }
            },

            randomString(length, chars) {
                var result = '';
                for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
                return result;
            },

            getEvents() {
                firebase.database().ref(`events/${this.uid}`).get('once').then((data) => {
                    var dat = data.val()
                    for(let i in dat) {
                        this.$store.commit('ADD_EVENT', {
                            eid: i,
                            ename: dat[i].ename,
                            edescription: dat[i].edescription,
                            eto: dat[i].eto,
                            efrom: dat[i].efrom,
                            sduration: dat[i].sduration,
                            recording: dat[i].recording,
                            sdomain: dat[i].sdomain,
                            streamkey: dat[i].streamkey,
                            status: dat[i].status
                        })
                    }
                })
            },

            openEvent(item) {
                this.dialog1 = true
                this.sdomain = item.sdomain
                this.streamkey = item.streamkey
                this.ename = item.ename
                this.evenT = item
                if(item.status == 'Active') {
                    let payload = JSON.stringify({name: item.sdomain, type: 'basic-server'})
                    console.log(payload);
                    axios.post('https://apis.avmediawork.in/test', payload, {
                        headers: {'Content-Type': 'application/json'}
                    })
                    .then((responce) => {
                        this.responce = responce.data
                        this.port = responce.data.spec.ports[0].nodePort
                    })
                    .catch((err) => {
                        console.log(err.message)
                    })
                }
            }
        },
        computed: {
            min () {
                let date = new Date
                return date.toISOString()
            },
            max () {
                let date = new Date
                date.setDate(date.getDate() + 31)
                return date.toISOString()
            },
            events () {
                return this.$store.getters.loadedEVENTS
            },
            uid () {
                return firebase.auth().currentUser.uid
            }
        },

        mounted() {
            var events = this.$store.getters.loadedEVENTS
            if (events.length <= 0) {
                this.getEvents()
            }
        }
    };
</script>