export default {
  curr_database() {
    return this.$store.query.db_name;
  },
  curr_database_type() {
    return this.$store.app.databases[this.curr_database].type;
  },
  is_hive_type() {
    return this.curr_database_type.toLowerCase() == 'spark' || this.curr_database_type.toLowerCase() == 'hive'
  },
  is_postgres_type() {
    return this.curr_database_type.toLowerCase() == 'redshift' || this.curr_database_type.toLowerCase() == 'postgresql'
  },
  sess_name() {
    return this.$store.query._session.name
  },
  sess_schema() {
    if (this.$store.query._session.schema.length == 0) return null
    else if (this.$store.query._session.schema.length == 1) return this.$store.query._session.schema[0]
    else return this.$store.query._session.schema;
  },
  sess_schema_obj_type() {
    return this.$store.query._session.schema_obj_type;
  },
  sess_schema_objects_selected() {
    return this.$store.query._session.schema_objects_selected;
  },
  sess_active_tab_index() {
    return this.$store.query._session.active_tab_index
  },
  sess_active_tab_id() {
    return this.sess_active_tab != null ? this.$store.query._session._tab.id : null
  },
  sess_active_tab() {
    return this.$store.query._session._tab
  },
  sess_active_child_tab_id() {
    return this.sess_active_child_tab != null ? this.sess_active_child_tab.id : null
  },
  sess_active_child_tab() {
    return this.$store.query._session._tab._child_tab
  },
  sess_active_child_long_name() {
    return this.$store.query._session._tab._child_tab.long_name
  },
  sess_tabs() {
    return this.$store.query._session.tabs
  },
  schemas() {
    return Object.keys(this.$store.query.meta.schema);
  },
  tables() {
    return this.$store.query.meta.schema[this.sess_schema].tables;
  },
  views() {
    return this.$store.query.meta.schema[this.sess_schema].views;
  },
  schema_objects() {
    return this.$store.query.meta.schema_objects[this.sess_schema_obj_type];
  },
  db_names() {
    return Object.keys(this.$store.app.databases)
  },
  omnibox_filtered() {
    let self=this
    let str_filter = this.$store.vars.omnibox_filter.toLowerCase()
    let options = []
    if(str_filter == '') {
      options = [
        'Type for table / views',
        '@ for connections',
        '! for sessions',
      ]
    } else if(str_filter.startsWith("@")) {
      // Connections
      str_filter = str_filter.substr(1)
      options = Object.keys(this.$store.app.databases).filter((option) => {
        return option
          .toString()
          .toLowerCase()
          .indexOf(str_filter) >= 0
      })
    } else if(str_filter.startsWith("!")) {
      // Sessions
      str_filter = str_filter.substr(1)
      options = Object.keys(this.$store.query.sessions).filter((option) => {
        return option
          .toString()
          .toLowerCase()
          .indexOf(str_filter) >= 0
      })
      
    } else {
      // Table / View Objects
      let all_obj = []

      self.get_filertered_schemas().forEach(function(schema_nm) {
        let schema = self.$store.query.meta.schema[schema_nm]
        all_obj = all_obj.concat(schema.tables.map(t => `${schema_nm}.${t}`))
        all_obj = all_obj.concat(schema.views.map(v => `${schema_nm}.${v}`))
      }, this);  

      options = all_obj.filter((option) => {
        return option
          .toString()
          .toLowerCase()
          .indexOf(str_filter) >= 0
      })
    }

    return options
  },
  
  get_schema_select_heigth() {
    return parseInt(window.innerHeight / 56, 10);
  },
  hot_selection_values() {
    return this.$store.vars.hot_selection_values;
  }
}