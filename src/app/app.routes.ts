import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { SignUpComponent } from './Components/sign-up/sign-up.component';
import { AddCategoryComponent } from './Components/add-category/add-category.component';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './Components/home/home.component';
import { AddProductComponent } from './Components/add-product/add-product.component';
import { ListProductComponent } from './Components/list-product/list-product.component';
import { AddCustomerComponent } from './Components/add-customer/add-customer.component';
import { ListCustomerComponent } from './Components/list-customer/list-customer.component';
import { AddSaleComponent } from './Components/add-sale/add-sale.component';
import { ListSaleComponent } from './Components/list-sale/list-sale.component';
import { InvoiceComponent } from './Components/invoice/invoice.component';
import { ListOrderComponent } from './Components/list-order/list-order.component';
import { SalesDashboardComponent } from './Components/sales-dashboard/sales-dashboard.component';
import { ListProductsComponent } from './Components/list-products/list-products.component';
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'orders', component: ListOrderComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'add-product', component: AddProductComponent, canActivate: [AuthGuard] },
  { path: 'list-product', component: ListProductsComponent, canActivate: [AuthGuard] },
  { path: 'products', component: ListProductComponent, canActivate: [AuthGuard] },
  { path: 'products/:id', component: ListProductComponent, canActivate: [AuthGuard] },
  { path: 'add-product/:id', component: AddProductComponent, canActivate: [AuthGuard] },
  { path: 'add-product/:categoryId', component: AddProductComponent, canActivate: [AuthGuard] },
  { path: 'list-customer', component: ListCustomerComponent, canActivate: [AuthGuard] },
  { path: 'add-customer', component: AddCustomerComponent, canActivate: [AuthGuard] },
  { path: 'add-customer/:id', component: AddCustomerComponent, canActivate: [AuthGuard]  },
  { path: 'add-sale', component: AddSaleComponent, canActivate: [AuthGuard] },
  { path: 'invoice/:saleId', component: InvoiceComponent, canActivate: [AuthGuard] },
  { path: 'list-sales', component: ListSaleComponent, canActivate: [AuthGuard] },
  { path: 'sale-dashboard', component: SalesDashboardComponent, canActivate: [AuthGuard] },

  
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'add-category', component: AddCategoryComponent, canActivate: [AuthGuard] }, // Protected route
  { path: '**', redirectTo: '/home' } // Wildcard route for a 404 page
];
