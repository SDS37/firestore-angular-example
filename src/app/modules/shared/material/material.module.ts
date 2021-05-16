import { NgModule } from '@angular/core';

// constants
import { Constants } from 'src/constants/constants';

@NgModule({
  imports: [
    Constants.ANGULAR_MATERIAL_MODULES
  ],
  exports: [
    Constants.ANGULAR_MATERIAL_MODULES
  ]
})

export class MaterialModule {}
