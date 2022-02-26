<template>
    <v-container>
        <v-row class="pa-3">
            <v-dialog v-model="dialog"
            persistent
            max-width="750px">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                    color="primary"
                    dark
                    v-bind="attrs"
                    v-on="on"
                    >
                    Create Event
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title>New Event</v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
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
                                <v-col cols="6">
                                    <v-file-input v-model="top" :rules="rules" accept="image/png, image/jpeg, image/bmp" show-size label="Top image (200kb max)"></v-file-input>
                                </v-col>
                                <v-col cols="6">
                                    <v-file-input v-model="bottom" :rules="rules" accept="image/png, image/jpeg, image/bmp" show-size label="Bottom image (200kb max)"></v-file-input>
                                </v-col>
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
                        <v-btn rounded color="green">Create</v-btn>
                        <v-btn @click="close" rounded color="red">Cancel</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        data: () => ({
            dialog: false,
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
        }),
        methods: {
            close() {
                this.dialog = false
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
        }
    };
</script>