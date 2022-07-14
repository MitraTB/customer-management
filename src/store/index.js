import { createStore } from "vuex";
import { AppModule } from "./Modules/AppModule";
import { IssueModule } from "./Modules/IssuesModule";

export default createStore({
  modules: {
    app: AppModule,
    issues: IssueModule,
  },
});
