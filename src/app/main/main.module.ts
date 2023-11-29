import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common"
import { Routes, RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { HarvestService } from "../services/harvest.service";
import { TimeEntriesReducer, reducers } from "./reducer/main.reducer";
import { TimeEffects } from "./effects/main.effects";
import { logger } from "./reducer/meta.reducer";
import { MainComponent } from "./main.component";
import { HolidayService } from "../services/holiday.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: "never" }),
    StoreModule.forRoot(reducers, { metaReducers: [logger] }),
    EffectsModule.forRoot([TimeEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
    }),
    BsDatepickerModule.forRoot(),
  ],
  declarations: [MainComponent],
  providers: [HarvestService, HolidayService],
})
export class MainModule {}
