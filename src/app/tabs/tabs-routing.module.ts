import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { LoginRequiredGuard } from '../guards/login-required.guard';
import { PurchasePage } from '../modules/shoptask/pages/purchase/purchase.page';
import { HistoryPage } from '../modules/shoptask/pages/history/history.page';
import { AccountPage } from '../modules/person/pages/account/account.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'purchase',
        canActivate: [LoginRequiredGuard],
        component: PurchasePage,
        // loadChildren: () => import('../modules/shoptask/pages/purchase/purchase.module').then(m => m.PurchasePageModule)
      },
      {
        path: 'history',
        canActivate: [LoginRequiredGuard],
        component: HistoryPage,
        // loadChildren: () => import('../modules/shoptask/pages/history/history.module').then(m => m.HistoryPageModule)
      },
      {
        path: 'account',
        canActivate: [LoginRequiredGuard],
        component: AccountPage,
        // loadChildren: () => import('../modules/person/pages/account/account.module').then(m => m.AccountPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/purchase',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/purchase',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
