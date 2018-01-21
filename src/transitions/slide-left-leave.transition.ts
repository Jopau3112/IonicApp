import { Animation, PageTransition } from "ionic-angular";

export class ModalSlideLeftLeaveTransition extends PageTransition {
  public init() {
    super.init();
    const ele = this.leavingView.pageRef().nativeElement;
    const wrapper = new Animation(
      this.plt,
      ele.querySelector(".modal-wrapper")
    );
    const contentWrapper = new Animation(
      this.plt,
      ele.querySelector(".wrapper")
    );

    wrapper.beforeStyles({ transform: "scale(1.0)", opacity: 1 });
    wrapper.fromTo(
      "transform",
      "translate3d(0, 0, 0)",
      "translate3d(-100%, 0, 0)"
    );
    wrapper.fromTo("opacity", 1, 1);
    contentWrapper.fromTo("opacity", 1, 0);

    this.element(this.leavingView.pageRef())
      .duration(500)
      .easing("ease-in-out 500ms")
      .add(contentWrapper)
      .add(wrapper);
  }
}
