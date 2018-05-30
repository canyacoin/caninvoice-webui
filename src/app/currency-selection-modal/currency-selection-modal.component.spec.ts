import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencySelectionModalComponent } from './currency-selection-modal.component';

describe('CurrencySelectionModalComponent', () => {
  let component: CurrencySelectionModalComponent;
  let fixture: ComponentFixture<CurrencySelectionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrencySelectionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencySelectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
