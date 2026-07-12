import { Routes } from '@angular/router';
import { ViewCashierComponent } from '../view-cashier/view-cashier.component';
import { ViewCookerComponent } from '../view-cooker/view-cooker.component';
import { RegistrarCobroComponent } from '../../../modules/pagos/registrar-cobro/registrar-cobro.component';
import { ConsultarPedidosComponent } from '../../../modules/pedidos/consultar-pedidos/consultar-pedidos.component';
import { RegistrarPedidosComponent } from '../../../modules/pedidos/registrar-pedidos/registrar-pedidos.component';
import { UpdatePedidosComponent } from '../../../modules/pedidos/update-pedidos/update-pedidos.component';
import { roleGuard } from '../../../auth/data-access/guards/role.guard';
import { notFoundRedirectGuard } from '../../../auth/data-access/guards/not-found-redirect.guard';
import { RedirectComponent } from '../../../shared/components/redirect/redirect.component';
import { ViewAdminComponent } from '../view-admin/view-admin.component';
import { DetailsComponent } from '../../../modules/comprobantes/details/details.component';
import { ReceiptsComponent } from '../../../modules/comprobantes/receipts/receipts.component';
import { RecordComponent } from '../../../modules/comprobantes/record/record.component';

export default [
  {
    path: 'cashier',
    canActivate: [roleGuard(['cashier'])],
    component: ViewCashierComponent,
  },
  {
    path: 'cashier/pagos/registrar-cobro',
    canActivate: [roleGuard(['cashier'])],
    component: RegistrarCobroComponent,
  },
  {
    path: 'cashier/pedidos/consultar-pedidos',
    canActivate: [roleGuard(['cashier'])],
    component: ConsultarPedidosComponent,
  },
  {
    path: 'cashier/pedidos/registrar-pedidos',
    canActivate: [roleGuard(['cashier'])],
    component: RegistrarPedidosComponent,
  },
  {
    path: 'cooker',
    canActivate: [roleGuard(['cooker'])],
    component: ViewCookerComponent,
  },
  {
    path: 'cooker/pedidos/consultar-pedidos',
    canActivate: [roleGuard(['cooker'])],
    component: ConsultarPedidosComponent,
  },
  {
    path: 'cooker/pedidos/update-pedidos',
    canActivate: [roleGuard(['cooker'])],
    component: UpdatePedidosComponent,
  },
  {
    path: 'admin',
    canActivate: [roleGuard(['admin'])],
    component: ViewAdminComponent,
  },
  {
    path: 'admin/details',
    canActivate: [roleGuard(['admin'])],
    component: DetailsComponent,
  },
  {
    path: 'admin/receipts',
    canActivate: [roleGuard(['admin'])],
    component: ReceiptsComponent,
  },
  {
    path: 'admin/record',
    canActivate: [roleGuard(['admin'])],
    component: RecordComponent,
  },
  {
    path: '**',
    canActivate: [notFoundRedirectGuard],
    component: RedirectComponent,
  },
] as Routes;
