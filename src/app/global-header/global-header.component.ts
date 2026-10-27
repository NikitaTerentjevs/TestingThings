
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-global-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './global-header.component.html',
  styleUrl: './global-header.component.scss'
})
export class GlobalHeaderComponent implements AfterViewInit, OnDestroy {
  @ViewChild('nav') nav!: ElementRef<HTMLElement>;


  links = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Contact', path: '/contact' }
  ];

  pillWidth = 0;
  pillHeight = 0;
  pillTransform = 'translate(0, 0)';
  pillVisible = false;


  private hoveredLink: HTMLElement | null = null;
  private observer?: MutationObserver;

  ngAfterViewInit(): void {
    this.observer = new MutationObserver(() => this.sync());

    this.observer.observe(this.nav.nativeElement, {
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });
  }

  onHover(event: PointerEvent): void {
    const currentTarget = event.currentTarget as HTMLElement;
    this.hoveredLink = currentTarget;
    this.sync();
  }

  onLeave(): void {
    this.hoveredLink = null;
    this.sync();
  }


sync(instant = false): void {
  const nav = this.nav.nativeElement;

  const target =
    nav.matches(':hover') && this.hoveredLink
      ? this.hoveredLink
      : nav.querySelector<HTMLElement>('a.active');

  if (!target || !target.offsetParent) {
    this.pillVisible = false;
    return;
  }

  const navRect = nav.getBoundingClientRect();
  const rect = target.getBoundingClientRect();


  this.pillWidth = rect.width;
  this.pillHeight = rect.height;
  this.pillTransform =
    `translate(${rect.left - navRect.left}px, ${rect.top - navRect.top}px)`;
  this.pillVisible = true;
}


  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
