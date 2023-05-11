<template>
    <v-container>
        <v-row class="pa-3">
            <v-btn color="primary" @click="newEvent">Create Event</v-btn>
            <v-dialog v-model="dialog"
            persistent
            max-width="850px">
                <v-card>
                    <v-card-title>New Event</v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="8">
                                    <v-row lazy-validation>
                                        <v-col cols="12">
                                            <v-text-field required v-model="ename" label="Event name"></v-text-field>
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
                                                v-model="efromdate"
                                                label="Start date"
                                                v-bind="attrs"
                                                v-on="on"
                                                readonly
                                                ></v-text-field>
                                                </template>
                                                <v-date-picker v-model="efromdate" :max="max" :min="min"></v-date-picker>
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
                                                <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                v-model="etime"
                                                label="Start time"
                                                v-bind="attrs"
                                                v-on="on"
                                                readonly
                                                ></v-text-field>
                                                </template>
                                                <v-time-picker
                                                    v-model="etime"
                                                    full-width
                                                    type="month"
                                                ></v-time-picker>
                                            </v-menu>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-select v-model="lduration" label="Live duration" :items="ldura"></v-select>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field :rules="sdrules" v-model="sdomain" suffix=".you2live.in" label="URL"></v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-checkbox v-model="recording" label="Recording"></v-checkbox>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-select v-model="rduration" :disabled="!recording" label="Recording duration" :items="rhrs"></v-select>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-select v-model="sduration" :disabled="!rduration" label="Storage duration" :items="sdays"></v-select>
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="4">
                                    <v-row>
                                        <v-col cols="12">
                                            <h2>Rate</h2>
                                        </v-col>
                                        <v-simple-table>
                                            <template v-slot:default>
                                                <thead>
                                                    <tr>
                                                        <th class="text-left">
                                                            Service
                                                        </th>
                                                        <th class="text-left">
                                                            Duration
                                                        </th>
                                                        <th class="text-right">
                                                            Amount(₹)
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Live</td>
                                                        <td>{{ lduration }}</td>
                                                        <td>{{ lcost }}</td>
                                                    </tr>
                                                    <tr>
                                                       <td>Recording</td>
                                                       <td>{{ rduration }}</td>
                                                        <td>{{ rcost }}</td>
                                                    </tr>
                                                    <tr>
                                                       <td>Storage</td>
                                                       <td>{{ sduration }}</td>
                                                        <td>{{ scost }}X</td>
                                                    </tr>
                                                </tbody>
                                            </template>
                                        </v-simple-table>
                                        <h3 class="green--text">Total amount: ₹{{ tamount }}  </h3>
                                        <h3>[ {{ lcost }} + ( {{ rcost }} x {{ scost }} )]</h3>
                                    </v-row>
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
                :loading="lisLoading"
                :headers="headers"
                :items="events">
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-icon
                            v-if="item.status == 'Inactive'"
                            small
                            color="orange"
                            class="mr-2"
                        >
                            mdi-pencil
                        </v-icon>
                        <v-icon
                            small
                            color="green"
                            class="mr-2"
                            @click="openEvent(item)"
                        >
                            mdi-wrench
                        </v-icon>
                        <v-btn @click="startServer(item)" v-if="item.status == 'Inactive'" color="green" small>Start server</v-btn>
                    </template>
                    <template v-slot:[`item.live`]="{ item }">
                        <v-btn text v-if="item.live" color="green" small>Live</v-btn>
                        <p v-else>-</p>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
        <v-row>
            <v-dialog
            v-model="dialog1"
            max-width="700"
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
                            <v-row v-if="evenT.status != 'Inactive'">
                                <table>
                                    <tr>
                                        <td>Stream link:</td>
                                        <td class="pa-3">https://{{sdomain}}.you2live.in
                                            <v-btn small icon @click="shareURL(`https://${sdomain}.you2live.in`)"> <v-icon> mdi-share-variant </v-icon> </v-btn>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Uplink:</td>
                                        <td class="pa-3">rtmp://{{sdomain}}.avmediawork.in:{{port}}/live
                                            <v-btn small icon @click="copyTXT(`rtmp://${sdomain}.avmediawork.in:${port}/live`)"> <v-icon> mdi-clipboard-text-multiple </v-icon> </v-btn>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Stream key:</td>
                                        <td class="pa-3">{{streamkey}}
                                            <v-btn icon small @click="copyTXT(`${streamkey}`)"> <v-icon> mdi-clipboard-text-multiple </v-icon> </v-btn>
                                        </td>
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
        <v-row>
            <v-dialog
            v-model="serloading"
            hide-overlay
            persistent
            width="300">
                <v-card>
                    <v-card-text>
                        Provisioning your server, please stand by...
                        <v-progress-linear
                        indeterminate
                        color="white"
                        class="mb-0"></v-progress-linear>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-row>
        <!-- <v-row>
            <video
            controls
            preload="auto"
            data-setup="{}">
                <source src="https://hls-nweve.avmediawork.in/live/sim1alm/index.m3u8" type="application/x-mpegURL" />
            </video>
                </v-row> -->
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
            viddialog: false,
            snackbar: false,
            port: '',
            snack: '',
            scolor: '',
            dialog: false,
            dialog1: false,
            serloading: false,
            sdomain: '',
            streamkey: '',
            sdrules: [
                v => !!v || 'Value is required',
                v => /^[a-zA-Z0-9]{4,20}$/.test(v) || 'Invalid value',
            ],
            headers: [
                {text: 'Event name', value: 'ename'},
                {text: 'Event Date', value: 'efrom'},
                {text: 'Stream', value: 'live'},
                {text: 'Status', value: 'status'},
                {text: 'Actions', value: 'actions'},
            ],
            rules: [
                value => !value || value.size < 200000 || 'Image size should be less than 200 KB!',
            ],
            sdays: ['30 Days', '60 Days', '90 Days', '180 Days'],
            lduration: '',
            ldura: ['12 Hours', '24 Hours', '48 Hours', '5 Days'],
            rduration: null,
            rhrs: ['2 Hours', '4 Hours', '8 Hours', '12 Hours', '24 Hours'],
            ename: '',
            edescription: '',
            eveList: [],
            efromdate: null,
            etime: null,
            top: null,
            bottom: null,
            recording: false,
            sduration: '',
            fmenu: false,
            tmenu: false,
            loading: false,
            uploading: false,
            responce: {},
            evenT: {},
            refresh: null,
        }),
        methods: {
            shareURL(url) {
                navigator.share({
                    url: url
                })
            },
            copyTXT(txt) {
                navigator.clipboard.writeText(txt)
                .then(() => {
                    this.$store.dispatch('createAlert',{type: 'success', message: 'Copied'})
                })
            },
            newEvent() {
                this.dialog = true
            },
            close() {
                this.dialog = false
                this.ename = ''
                this.edescription = ''
                this.efromdate = null
                this.etime = null
                this.sduration = ''
                this.recording = false
                this.loading = false
            },
            async listEvents () {
                this.eveList = []
                let events = this.events
                for(let i in events) {
                    let url = `https://hls-${events[i].sdomain}.avmediawork.in/api/streams`
                    let stat = false
                    if(events[i].status == 'Server running') {
                        stat = await this.getStream(url)
                    }
                    let list = {
                        eid: events[i].eid,
                        ename: events[i].ename,
                        edescription: events[i].edescription,
                        eto: events[i].eto,
                        efrom: events[i].efrom,
                        sduration: events[i].sduration,
                        recording: events[i].recording,
                        sdomain: events[i].sdomain,
                        streamkey: events[i].streamkey,
                        status: events[i].status,
                        // payment: events[i].payment,
                        live: stat.live,
                        stream: `https://hls-${events[i].sdomain}.avmediawork.in/live/${events[i].streamkey}/index.m3u8`
                    }
                    this.eveList.push(list)
                }
            },
            async refreshEvents () {
                let events = this.events
                for(let i in events) {
                    if(events[i].status == 'Server running') {
                        let url = `https://hls-${events[i].sdomain}.avmediawork.in/api/streams`
                        let stat = await this.getStream(url)
                        this.eveList[i].live = stat.live
                    }
                }
            },
            async getStream (url) {
                let responce = await axios.get(url)
                let dat = Object.values(responce.data)
                if (dat.length > 0) {
                    let stream = Object.values(responce.data.live)
                    let publisher = stream[0].publisher
                    let subs = stream[0].subscribers
                    let rtmpCon = subs.filter((con) => {
                        return con.protocol = 'rtmp'
                    })
                    let live = false
                    if(publisher) {
                        live = true
                    }
                    return {
                        live: live,
                        rtmpCon: rtmpCon.length
                    }
                }
                else {
                    return {
                        live: false,
                        rtmpCon: false
                    }
                }
                
            },
            startServer (item) {
                this.serloading = true
                let payload = JSON.stringify({name: item.sdomain, type: 'basic-server'})
                axios.post('https://apis.avmediawork.in/create', payload, {
                    headers: {'Content-Type': 'application/json'}
                })
                .then((responce) => {
                    this.responce = responce.data
                    this.port = responce.data.spec.ports[0].nodePort
                    var url = `https://hls-${item.sdomain}.avmediawork.in/live/${item.streamkey}/index.m3u8`
                    firebase.database().ref(`streams/${item.sdomain}`).set({
                        url: url,
                        stname: this.user.name,
                        logo: this.user.logo,
                        phone: this.user.phone
                    })
                    firebase.database().ref(`events/${this.uid}/${item.eid}`).update({status: 'Server running'})
                    .then(() => this.$store.dispatch('getEvents', this.uid))
                    this.serloading = false
                    this.$store.dispatch('createAlert',{type: 'success', message: 'Server created'})
                })
                .catch((err) => {
                    this.$store.dispatch('createAlert',{type: 'error', message: err.message})
                    this.serloading = false
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
                    status: 'Inactive',
                    // payment: 'Paid'
                }
                //var url = `https://${this.sdomain}.you2live.in/live/${rString}/index.m3u8`
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
                this.$store.dispatch('getEvents', this.uid)
            },

            openEvent(item) {
                this.dialog1 = true
                this.sdomain = item.sdomain
                this.streamkey = item.streamkey
                this.ename = item.ename
                this.evenT = item
                if(item.status != 'Inactive') {
                    let payload = JSON.stringify({name: item.sdomain, type: 'basic-server'})
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
            },

            dateTest() {
                // let d = new Date(this.efromdate)
                // let [hours, minutes] = this.etime.split(':')
                // let totalMilliseconds = (+hours * 60 * 60 * 1000) + (+minutes * 60 * 1000)
                // let t = +d.getTime() + +totalMilliseconds
                // let n = 
                //d.setDate(this.efromdate)
                //d.setTime(this.etime)
                //console.log(d) 
            }
        },
        computed: {
            startTime() {
                // if (this.efromdate && this.etime) {
                //     let d = new Date()
                //     d.setDate(this.efromdate)
                //     d.setTime(this.etime)
                //     return d.toISOString()
                // } else {
                    return 0
                //}
            },

            lcost() {
                if(this.lduration == '12 Hours') return 150
                else if(this.lduration == '24 Hours') return 250
                else if(this.lduration == '48 Hours') return 400
                else if(this.lduration == '5 Days') return 800
                else return 0
            },

            rcost() {
                if(this.rduration == '2 Hours') return 200
                else if(this.rduration == '4 Hours') return 350
                else if(this.rduration == '8 Hours') return 600
                else if(this.rduration == '12 Hours') return 1000
                else if(this.rduration == '24 Hours') return 1500
                else return 0
            },
            
            scost() {
                if(this.sduration == '30 Days') return 1
                else if(this.sduration == '60 Days') return 2
                else if(this.sduration == '90 Days') return 3
                else if(this.sduration == '180 Days') return 6
                else return 0
            },

            tamount() {
                return +this.lcost + (+this.rcost * +this.scost)
            },

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
            },
            lisLoading () {
                if(this.eveList.length <= 0) {
                    return false
                } else {
                    return true
                }
            },
            user () {
            return this.$store.getters.userProfile
        }
        },

        mounted() {
            var events = this.$store.getters.loadedEVENTS
            if (events.length <= 0) {
                this.getEvents()
            }

        },
        beforeDestroy () {
            clearInterval(this.refresh)
        }
    };
</script>

<style scoped>

</style>