import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { GoodsEditorQuantityComponent } from '../../components/goods-editor-quantity/goods-editor-quantity.component';
import { metrics } from '../../utils/metric';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.page.html',
  styleUrls: ['./catalog.page.scss'],
})
export class CatalogPage implements OnInit {

  purchaseUUID: string;
  showSearch: boolean = false;
  showCategory: boolean = false;
  isReview: boolean = false;
  goodsCache: any;

  goods: any = [
    {
      'id': 1,
      'label': 'Kacang Atom Pilus putih',
      'quantity': 2,
      'metric': metrics.pack,
      'picture': 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==',
      'is_selected': true,
    },
    {
      'id': 2,
      'label': 'Beras Naruto 20kg',
      'quantity': 1,
      'metric': metrics.sack,
      'picture': 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==',
      'is_selected': true,
    },
    {
      'id': 3,
      'label': 'Sabun cuci Daia 500 gram',
      'quantity': 0,
      'metric': '',
      'picture': 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==',
      'is_selected': false,
    }
  ];

  goodsSelected: any = [
    {
      'id': 1,
      'label': 'Kacang Atom Pilus putih',
      'quantity': 2,
      'metric': metrics.pack,
      'picture': 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==',
      'is_selected': true,
    },
    {
      'id': 2,
      'label': 'Beras Naruto 20kg',
      'quantity': 1,
      'metric': metrics.sack,
      'picture': 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==',
      'is_selected': true,
    }
  ]

  constructor(
    private route: ActivatedRoute,
    private modalCtrl: ModalController
  ) { }

  async modalGoodsEditorQuantity(item: any) {
    const modal = await this.modalCtrl.create({
      component: GoodsEditorQuantityComponent,
      componentProps: {
        'item': item
      }
    });

    modal.onDidDismiss()
      .then((response: any) => {
        let item = response.data.item;
        if (item) this.goodsSelected.push(item);
    });

    return await modal.present();
  }

  selectItem(item: any, isRemove: boolean = false): void {
    if (isRemove === false) {
      this.modalGoodsEditorQuantity(item);
    }

    if (isRemove) {
      let index = this.goods.findIndex((d: any) => d.id == item.id);

      this.goods[index].is_selected = false;
      this.goods[index].quantity = 0;
      this.goods[index].metric = '';

      this.goodsSelected = this.goodsSelected.filter((d: any) => d.id != item.id);
    }
  }

  ngOnInit() {
    this.purchaseUUID = this.route.snapshot.paramMap.get('uuid');
  }

  openSearch(): void {
    this.showSearch = true;
  }

  closeSeach(): void {
    this.showSearch = false;
  }

  openCategory(): void {
    this.showCategory = true;
  }

  closeCategory(): void {
    this.showCategory = false;
  }

  review(): any {
    this.isReview = true;
    this.goodsCache = this.goods;
    this.goods = this.goodsSelected;
  }

  closeReview(): any {
    this.isReview = false;
    this.goods = this.goodsCache;
    delete this.goodsCache;
  }

}
