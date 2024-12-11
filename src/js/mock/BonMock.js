import HttpMock from "@ocdla/lib-http/HttpMock";
import Url from "@ocdla/lib-http/Url";
import BonIndex from "./data/books.xml";

import fsmForeword from "./data/fsm/fsm-foreword.html";
import fsmOutline from "./data/fsm/fsm-outline.html";
import fsm1 from "./data/fsm/fsm-1.html";
import fsm2 from "./data/fsm/fsm-2.html";
import fsm3 from "./data/fsm/fsm-3.html";
import fsm4 from "./data/fsm/fsm-4.html";
import fsm5 from "./data/fsm/fsm-5.html";
import fsm6 from "./data/fsm/fsm-6.html";
import fsm7 from "./data/fsm/fsm-7.html";
import fsm8 from "./data/fsm/fsm-8.html";
import fsm9 from "./data/fsm/fsm-9.html";
import fsm10 from "./data/fsm/fsm-10.html";

import ss1a from "./data/ss/ss-1a.html";
import ss1b from "./data/ss/ss-1b.html";
import ss1c from "./data/ss/ss-1c.html";
import ss2a from "./data/ss/ss-2a.html";
import ss2b from "./data/ss/ss-2b.html";
import ss2c from "./data/ss/ss-2c.html";
import ss2d from "./data/ss/ss-2d.html";
import ss2e from "./data/ss/ss-2e.html";
import ss2f from "./data/ss/ss-2f.html";
import ss3a from "./data/ss/ss-3a.html";
import ss3b from "./data/ss/ss-3b.html";
import ss3c from "./data/ss/ss-3c.html";
import ss3d from "./data/ss/ss-3d.html";
import ss3e from "./data/ss/ss-3e.html";
import ss3f from "./data/ss/ss-3f.html";
import ss3g from "./data/ss/ss-3g.html";
import ss4 from "./data/ss/ss-4.html";
import ss5a from "./data/ss/ss-5a.html";
import ss5b from "./data/ss/ss-5b.html";
import ss5c from "./data/ss/ss-5c.html";
import ss6 from "./data/ss/ss-6.html";
import ss7 from "./data/ss/ss-7.html";
//import ss8 from "./data/ss/ss-8.html";
import ss9 from "./data/ss/ss-9.html";
import ss10 from "./data/ss/ss-10.html";

import tn1 from "./data/tn/tn-1.html";
import tn2 from "./data/tn/tn-2.html";
import tn3 from "./data/tn/tn-3.html";
import tn4 from "./data/tn/tn-4.html";
import tn5 from "./data/tn/tn-5.html";
import tn6 from "./data/tn/tn-6.html";
import tn7 from "./data/tn/tn-7.html";
import tn8 from "./data/tn/tn-8.html";
import tn9 from "./data/tn/tn-9.html";
import tn10 from "./data/tn/tn-10.html";
import tn11 from "./data/tn/tn-11.html";
import tn12 from "./data/tn/tn-12.html";
import tn13 from "./data/tn/tn-13.html";
import tn14 from "./data/tn/tn-14.html";
import tn15 from "./data/tn/tn-15.html";
import tn16 from "./data/tn/tn-16.html";
import tn17 from "./data/tn/tn-17.html";
import tn18 from "./data/tn/tn-18.html";

import vmDedication from "./data/vm/vm-dedication.html";
import vmForeword from "./data/vm/vm-foreword.html";
import vmIntroduction from "./data/vm/vm-introduction.html";
import vm1 from "./data/vm/vm-1.html";
import vm2 from "./data/vm/vm-2.html";
import vm3 from "./data/vm/vm-3.html";
import vm4 from "./data/vm/vm-4.html";
import vm5 from "./data/vm/vm-5.html";
import vm6 from "./data/vm/vm-6.html";
import vm7 from "./data/vm/vm-7.html";
import vm8 from "./data/vm/vm-8.html";
import vm9 from "./data/vm/vm-9.html";
import vm10 from "./data/vm/vm-10.html";
import vm11 from "./data/vm/vm-11.html";
import vm12 from "./data/vm/vm-12.html";
import vm13 from "./data/vm/vm-13.html";
import vm14 from "./data/vm/vm-14.html";
import vm15 from "./data/vm/vm-15.html";

import pjm1 from "./data/pjm/pjm-1.html";
import pjm2 from "./data/pjm/pjm-2.html";
import pjm3 from "./data/pjm/pjm-3.html";
import pjm4 from "./data/pjm/pjm-4.html";
import pjm5 from "./data/pjm/pjm-5.html";
import pjm6 from "./data/pjm/pjm-6.html";
import pjm7 from "./data/pjm/pjm-7.html";
import pjm8 from "./data/pjm/pjm-8.html";
import pjm9 from "./data/pjm/pjm-9.html";
import pjm10 from "./data/pjm/pjm-10.html";
import pjm11 from "./data/pjm/pjm-11.html";
import pjmsec2 from "./data/pjm/pjm-sec2.html";
import pjmsec3 from "./data/pjm/pjm-sec3.html";
import pjmsec4 from "./data/pjm/pjm-sec4.html";

import mhcd1 from "./data/mhcd/mhcd-1.html";
import mhcd2 from "./data/mhcd/mhcd-2.html";
import mhcd3 from "./data/mhcd/mhcd-3.html";
import mhcd4 from "./data/mhcd/mhcd-4.html";
import mhcd5 from "./data/mhcd/mhcd-5.html";
import mhcd6 from "./data/mhcd/mhcd-6.html";
import mhcd7 from "./data/mhcd/mhcd-7.html";
import mhcd8 from "./data/mhcd/mhcd-8.html";

import im1 from "./data/im/im-1.html";
import im2 from "./data/im/im-2.html";
import im3 from "./data/im/im-3.html";
import im4 from "./data/im/im-4.html";
import im5 from "./data/im/im-5.html";
import im6 from "./data/im/im-6.html";
import im7 from "./data/im/im-7.html";
import im8 from "./data/im/im-8.html";
import im9 from "./data/im/im-9.html";
import im10 from "./data/im/im-10.html";
import im11 from "./data/im/im-11.html";
import im12 from "./data/im/im-12.html";
import im13 from "./data/im/im-13.html";
import im14 from "./data/im/im-14.html";
import im15 from "./data/im/im-15.html";
import im16 from "./data/im/im-16.html";
import im17 from "./data/im/im-17.html";
import im18 from "./data/im/im-18.html";

import dnbIntroduction from "./data/dnb/dnb-introduction.html";
import dnb1 from "./data/dnb/dnb-1.html";
import dnb2 from "./data/dnb/dnb-2.html";
import dnb3 from "./data/dnb/dnb-3.html";
import dnb4 from "./data/dnb/dnb-4.html";
import dnb5 from "./data/dnb/dnb-5.html";
import dnb6 from "./data/dnb/dnb-6.html";
import dnb7 from "./data/dnb/dnb-7.html";
import dnb8 from "./data/dnb/dnb-8.html";
import dnb9 from "./data/dnb/dnb-9.html";
import dnb10 from "./data/dnb/dnb-10.html";
import dnb11 from "./data/dnb/dnb-11.html";
import dnb12 from "./data/dnb/dnb-12.html";
import dnb13 from "./data/dnb/dnb-13.html";
import dnb14 from "./data/dnb/dnb-14.html";
import dnb15 from "./data/dnb/dnb-15.html";
import dnb16 from "./data/dnb/dnb-16.html";
import dnb17 from "./data/dnb/dnb-17.html";
import dnb18 from "./data/dnb/dnb-18.html";

import dscForeword from "./data/dsc/dsc-foreword.html";
import dscIntroduction from "./data/dsc/dsc-introduction.html";
import dsc1 from "./data/dsc/dsc-1.html";
import dsc2 from "./data/dsc/dsc-2.html";
import dsc3 from "./data/dsc/dsc-3.html";
import dsc4 from "./data/dsc/dsc-4.html";
import dsc5 from "./data/dsc/dsc-5.html";
import dsc6 from "./data/dsc/dsc-6.html";
import dsc7 from "./data/dsc/dsc-7.html";
import dsc8 from "./data/dsc/dsc-8.html";
import dsc9 from "./data/dsc/dsc-9.html";
import dsc10 from "./data/dsc/dsc-10.html";
import dsc11 from "./data/dsc/dsc-11.html";
import dsc12 from "./data/dsc/dsc-12.html";
import dsc13 from "./data/dsc/dsc-13.html";
import dsc14 from "./data/dsc/dsc-14.html";
import dsc15 from "./data/dsc/dsc-15.html";
import dsc16 from "./data/dsc/dsc-16.html";
import dsc17 from "./data/dsc/dsc-17.html";
import dsc18 from "./data/dsc/dsc-18.html";
import dsc19 from "./data/dsc/dsc-19.html";
import dscBibliography from "./data/dsc/dsc-bibliography.html";

import semIntroduction from "./data/sem/sem-introduction.html";
import sem1 from "./data/sem/sem-1.html";
import sem2 from "./data/sem/sem-2.html";
import sem3 from "./data/sem/sem-3.html";
import sem4 from "./data/sem/sem-4.html";
import sem5 from "./data/sem/sem-5.html";
import sem6 from "./data/sem/sem-6.html";
import sem7 from "./data/sem/sem-7.html";

export { BonMock };

class BonMock extends HttpMock {
  imports = {
    "/sem/introduction": semIntroduction,
    "/sem/1": sem1,
    "/sem/2": sem2,
    "/sem/3": sem3,
    "/sem/4": sem4,
    "/sem/5": sem5,
    "/sem/6": sem6,
    "/sem/7": sem7,
    "/fsm/foreword": fsmForeword,
    "/fsm/outline": fsmOutline,
    "/fsm/1": fsm1,
    "/fsm/2": fsm2,
    "/fsm/3": fsm3,
    "/fsm/4": fsm4,
    "/fsm/5": fsm5,
    "/fsm/6": fsm6,
    "/fsm/7": fsm7,
    "/fsm/8": fsm8,
    "/fsm/9": fsm9,
    "/fsm/10": fsm10,
    "/ss/1a": ss1a,
    "/ss/1b": ss1b,
    "/ss/1c": ss1c,
    "/ss/2a": ss2a,
    "/ss/2b": ss2b,
    "/ss/2c": ss2c,
    "/ss/2d": ss2d,
    "/ss/2e": ss2e,
    "/ss/2f": ss2f,
    "/ss/3a": ss3a,
    "/ss/3b": ss3b,
    "/ss/3c": ss3c,
    "/ss/3d": ss3d,
    "/ss/3e": ss3e,
    "/ss/3f": ss3f,
    "/ss/3g": ss3g,
    "/ss/4": ss4,
    "/ss/5a": ss5a,
    "/ss/5b": ss5b,
    "/ss/5c": ss5c,
    "/ss/6": ss6,
    "/ss/7": ss7,
    //"/ss/8": ss8,
    "/ss/9": ss9,
    "/ss/10": ss10,
    "/mhcd/1": mhcd1,
    "/mhcd/2": mhcd2,
    "/mhcd/3": mhcd3,
    "/mhcd/4": mhcd4,
    "/mhcd/5": mhcd5,
    "/mhcd/6": mhcd6,
    "/mhcd/7": mhcd7,
    "/mhcd/8": mhcd8,
    "/im/1": im1,
    "/im/2": im2,
    "/im/3": im3,
    "/im/4": im4,
    "/im/5": im5,
    "/im/6": im6,
    "/im/7": im7,
    "/im/8": im8,
    "/im/9": im9,
    "/im/10": im10,
    "/im/11": im11,
    "/im/12": im12,
    "/im/13": im13,
    "/im/14": im14,
    "/im/15": im15,
    "/im/16": im16,
    "/im/17": im17,
    "/im/18": im18,
    "/dnb/introduction": dnbIntroduction,
    "/dnb/1": dnb1,
    "/dnb/2": dnb2,
    "/dnb/3": dnb3,
    "/dnb/4": dnb4,
    "/dnb/5": dnb5,
    "/dnb/6": dnb6,
    "/dnb/7": dnb7,
    "/dnb/8": dnb8,
    "/dnb/9": dnb9,
    "/dnb/10": dnb10,
    "/dnb/11": dnb11,
    "/dnb/12": dnb12,
    "/dnb/13": dnb13,
    "/dnb/14": dnb14,
    "/dnb/15": dnb15,
    "/dnb/16": dnb16,
    "/dnb/17": dnb17,
    "/dnb/18": dnb18,
    "/dsc/foreword": dscForeword,
    "/dsc/outline": dscIntroduction,
    "/dsc/1": dsc1,
    "/dsc/2": dsc2,
    "/dsc/3": dsc3,
    "/dsc/4": dsc4,
    "/dsc/5": dsc5,
    "/dsc/6": dsc6,
    "/dsc/7": dsc7,
    "/dsc/8": dsc8, 
    "/dsc/9": dsc9, 
    "/dsc/10": dsc10, 
    "/dsc/11": dsc11, 
    "/dsc/12": dsc12, 
    "/dsc/13": dsc13, 
    "/dsc/14": dsc14, 
    "/dsc/15": dsc15, 
    "/dsc/16": dsc16, 
    "/dsc/17": dsc17, 
    "/dsc/18": dsc18, 
    "/dsc/19": dsc19, 
    "/dsc/bibliography": dscBibliography,
    "/pjm/1": pjm1,
    "/pjm/2": pjm2,
    "/pjm/3": pjm3,
    "/pjm/4": pjm4,
    "/pjm/5": pjm5,
    "/pjm/6": pjm6,
    "/pjm/7": pjm7,
    "/pjm/8": pjm8,
    "/pjm/9": pjm9,
    "/pjm/10": pjm10,
    "/pjm/11": pjm11,
    "/pjm/sec2": pjmsec2,
    "/pjm/sec3": pjmsec3,
    "/pjm/sec4": pjmsec4,
    "/vm/dedication": vmDedication,
    "/vm/foreword": vmForeword,
    "/vm/introduction": vmIntroduction,
    "/vm/1": vm1,
    "/vm/2": vm2,
    "/vm/3": vm3,
    "/vm/4": vm4,
    "/vm/5": vm5,
    "/vm/6": vm6,
    "/vm/7": vm7,
    "/vm/8": vm8,
    "/vm/9": vm9,
    "/vm/10": vm10,
    "/vm/11": vm11,
    "/vm/12": vm12,
    "/vm/13": vm13,
    "/vm/14": vm14,
    "/vm/15": vm15,
    "/tn/1": tn1,
    "/tn/2": tn2,
    "/tn/3": tn3,
    "/tn/4": tn4,
    "/tn/5": tn5,
    "/tn/6": tn6,
    "/tn/7": tn7,
    "/tn/8": tn8,
    "/tn/9": tn9,
    "/tn/10": tn10,
    "/tn/11": tn11,
    "/tn/12": tn12,
    "/tn/13": tn13,
    "/tn/14": tn14,
    "/tn/15": tn15,
    "/tn/16": tn16,
    "/tn/17": tn17,
    "/tn/18": tn18
  };
  errors = {
    success: false,
    error: "Invalid inputs",
  };

  getResponse(req) {
    let url = new Url(req.url);
    let id = url.getPath();
    return id.includes("index") ? new Response(BonIndex, {headers: { "Content-Type": "application/xml" }}) : new Response(this.imports[id]);
  }
}
