import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'purchase',
    children: [
      {
        path: ':purchase_uuid',
        children: [
          {
            path: '',
            loadChildren: () => import('./pages/purchase-detail/purchase-detail.module').then(m => m.PurchaseDetailPageModule)
          },
          {
            path: 'necessary',
            children: [
              {
                path: ':necessary_uuid',
                children: [
                  {
                    path: 'goods',
                    children: [
                      {
                        path: '',
                        loadChildren: () => import('./pages/goods/goods.module').then( m => m.GoodsPageModule)
                      },
                      {
                        path: 'catalog',
                        loadChildren: () => import('./pages/catalog/catalog.module').then( m => m.CatalogPageModule)
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/purchase',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoptaskRoutingModule {}
