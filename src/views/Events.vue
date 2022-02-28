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
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field v-model="eid" label="Event ID"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field v-model="ename" label="Event name"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-textarea v-model="edescription" label="Event description"></v-textarea>
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
                                    <v-checkbox v-model="recording" label="Recording"></v-checkbox>
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
                sort-desc=""
                :headers="headers"
                :items="events"></v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/database'
    export default {
        data: () => ({
            dialog: false,
            headers: [
                {text: 'Event ID', sortable: true, value: 'eid'},
                {text: 'Event name', value: 'ename'},
            ],
            rules: [
                value => !value || value.size < 200000 || 'Avatar size should be less than 200 KB!',
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
            eid: '',
            loading: false,
        }),
        methods: {
            newEvent() {
                this.getEID()
                this.dialog = true
            },
            close() {
                this.dialog = false
                this.eid = ''
                this.ename = ''
                this.edescription = ''
                this.efrom = null
                this.eto = null
                this.sduration = ''
                this.recording = false
                this.loading = false
            },
            getEID() {
                firebase.database().ref('counter/eid').get('once').then((data) => {
                    this.eid = +data.val() + 1
                })
            },
            async createEvent() {
                this.loading = true
                var eid = null
                var event = {
                    ename: this.ename,
                    edescription: this.edescription,
                    efrom: this.efrom,
                    eto: this.eto,
                    recording: this.recording,
                    sduration: this.sduration
                }
                var counter = await firebase.database().ref('counter/eid').get('once')
                eid = +counter.val() + 1
                console.log(counter);
                await firebase.database().ref(`events/${eid}`).set(event)
                await firebase.database().ref('counter/eid').set(eid)
                this.$store.commit('ADD_EVENT', {eid: eid, ...event})
                this.close()
            },

            getEvents() {
                firebase.database().ref('events').get('once').then((data) => {
                    console.log(data.val())
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
                        })
                    }
                })
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