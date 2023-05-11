import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appHoverPropagation]'
})
export class HoverPropagationDirective {

  constructor() { }

  @HostListener('mouseenter', ['$event'])
  @HostListener('mouseleave', ['$event'])
  public onHover(event: MouseEvent): void {
    event.stopPropagation();
  }
}
