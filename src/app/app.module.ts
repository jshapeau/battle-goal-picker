//ANGULAR
import { NgModule, isDevMode } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

//GENERAL
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//APP
import { BattlegoalsComponent, BattleGoalDialog } from './battlegoals/battlegoals.component';
import { LocalBattleGoalDataSource } from './services'

//UI
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';

//DATA SOURCES
import JsonData from '../assets/data/battlegoals.json';

@NgModule({
  declarations: [
    AppComponent,
    BattlegoalsComponent,
    BattleGoalDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,

    //UI  
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatSidenavModule,
    MatTabsModule,
    MatDialogModule,
    MatExpansionModule
  ],
  providers: [
    { provide: 'BattlegoalDataSource', useFactory: () => (new LocalBattleGoalDataSource(JsonData)) },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
