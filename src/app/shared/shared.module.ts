import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  imports: [CommonModule, NgxPaginationModule],
  declarations: [LoaderComponent],
  exports: [LoaderComponent, NgxPaginationModule]
})
export class SharedModule {}
