import { Animation, PageTransition } from "ionic-angular";

export class ModalSlideLeftEnterTransition extends PageTransition {
  public init() {
    super.init();
    const ele = this.enteringView.pageRef().nativeElement;
    const wrapper = new Animation(
      this.plt,
      ele.querySelector(".modal-wrapper")
    );

    wrapper.beforeStyles({ transform: "scale(1.0)", opacity: 1 });
    wrapper.fromTo(
      "transform",
      "translate3d(-100%, 0, 0)",
      "translate3d(0, 0, 0)"
    );
    wrapper.fromTo("opacity", 1, 1);

    this.element(this.enteringView.pageRef())
      .duration(500)
      .easing("cubic-bezier(0.1, 0.7, 0.1, 1) 800ms")
      .add(wrapper);
  }
}
