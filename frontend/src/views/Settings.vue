<template>
  <div style="padding: 20px">
      <h1 class="title">Settings</h1>

      <div class="columns">
        <div class="column">
          <section>
              <div class="field">
                <b-field label="Performance Monitoring"/>
                  <b-switch v-model="$store.settings.perfMonitoringEnabled">
                      {{ $store.settings.perfMonitoringEnabled? 'Enabled':'Disabled' }}
                  </b-switch>
              </div>
              <div class="field">
                <b-field label="Hide Sidebase"/>
                  <b-switch v-model="$store.settings.sidebar_shown">
                      {{ $store.settings.sidebar_shown? 'Shown':'Hidden' }}
                  </b-switch>
              </div>
              <div class="field">
                <b-field label="Spark Progress Bar"/>
                  <b-switch v-model="$store.settings.query_progress_enabled">
                      {{ $store.settings.query_progress_enabled? 'Enabled':'Disabled' }}
                  </b-switch>
              </div>
              <div class="field">
                <b-field label="Progress Interval"/>

                  <select title="Limit" class="select is-small"
                          v-model="$store.settings.progress_interval"
                  >
                    <option selected>250</option>
                    <option>500</option>
                    <option>750</option>
                    <option>1000</option>
                    <option>1250</option>
                    <option>1500</option>
                    <option>2000</option>
                    <option>5000</option>
                  </select>
              </div>
              <div class="field">
                <b-field label="Default Query Limit"/>

                  <select title="Limit" class="select is-small"
                          v-model="$store.settings.default_query_limit"
                  >
                    <option selected>200</option>
                    <option>500</option>
                    <option>1000</option>
                    <option>2500</option>
                    <option>5000</option>
                    <option>10000</option>
                  </select>
              </div>
              <div class="field">
                <b-field label="Query Editor Font Size"/>

                  <select title="Font Size" class="select is-small"
                          v-model="$store.settings.editor_font_size"
                  >
                    <option>0.6rem</option>
                    <option>0.7rem</option>
                    <option>0.8rem</option>
                    <option>0.9rem</option>
                    <option>1.0rem</option>
                  </select>
              </div>
          </section>
          <br/>
          <section>
              <b-field label="Sidebar Width"/>
              <b-field>
                  <b-radio-button v-model="$store.style.sidebar_width"
                      native-value="180px">
                      <span>180px</span>
                  </b-radio-button>

                  <b-radio-button v-model="$store.style.sidebar_width"
                      native-value="200px">
                      <span>200px</span>
                  </b-radio-button>

                  <b-radio-button v-model="$store.style.sidebar_width"
                      native-value="220px">
                      <span>220px</span>
                  </b-radio-button>

                  <b-radio-button v-model="$store.style.sidebar_width"
                      native-value="250px">
                      <span>250px</span>
                  </b-radio-button>
              </b-field>
          </section>
          <br/>
          <section>
              <b-field label="Query Pane Width"/>
              <b-field>
                  <b-radio-button v-model="$store.settings.pane_width"
                      native-value="2">
                      <span>Small</span>
                  </b-radio-button>

                  <b-radio-button v-model="$store.settings.pane_width"
                      native-value="3">
                      <span>Medium</span>
                  </b-radio-button>

                  <b-radio-button v-model="$store.settings.pane_width"
                      native-value="4">
                      <span>Large</span>
                  </b-radio-button>

                  <b-radio-button v-model="$store.settings.pane_width"
                      native-value="5">
                      <span>X-Large</span>
                  </b-radio-button>
              </b-field>
          </section>
        </div>
        <div class="column">
          <button @click="toggle_viewer()" class="button is-primary">Toggle Profile</button>
          <button v-if="show_viewer" @click="load_profile()" class="button is-warning">Refresh</button>
          <button v-if="show_viewer" @click="save_profile()" class="button is-info">Save</button>
          <div v-if="show_viewer">
            <textarea v-model="profile_text" class="codelike" name="profile" id="profile-viewer" rows="40" style="width:100%" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
            </textarea>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import { SideMenu } from "../components/layout/";

export default {
  name: "Home",
  components: {
    // "side-menu": SideMenu
  },
  data() {
    return {
      msg: "Vue.js starter with full-featured Webpack and Buefy",
      isSwitched: false,
      isSwitchedCustom: "Yes",
      profile_text: "",
      show_viewer: false
    };
  },
  methods: {
    toggle_viewer() {
      this.show_viewer = !this.show_viewer;
      if (this.show_viewer) this.load_profile();
    },
    load_profile() {
      let self = this;
      let data1 = {
        type: "load"
      };
      this.$socket.emit("profile-request", data1, function(data2) {
        if (!data2.completed) {
          self.notify(data2);
        } else {
          self.profile_text = data2.text;
        }
      });
    },
    save_profile() {
      let self = this;
      let data1 = {
        type: "save",
        text: this.profile_text
      };
      this.$socket.emit("profile-request", data1, function(data2) {
        if (data2.completed) {
          self.$snackbar.open({
            duration: 2000,
            message: `Saved.`
          });
          self.get_databases(); // refresh database list
        } else {
          self.notify(data2);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.additional-bar {
  padding: 15px;
}

.gh-btn {
  background-color: #eee;
  background-repeat: no-repeat;
  border: 1px solid #d5d5d5;
  border-radius: 4px;
  color: #333;
  text-decoration: none;
  text-shadow: 0 1px 0 #fff;
  white-space: nowrap;
  cursor: pointer;
}
</style>

