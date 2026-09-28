import{$ as e,$n as t,$r as n,$t as r,A as i,An as a,Ar as o,At as s,B as c,Bn as l,Br as u,Bt as d,C as f,Cn as p,Cr as m,Ct as h,D as g,Dn as _,Dr as v,Dt as y,E as b,En as x,Er as S,Et as C,F as w,Fn as T,Fr as E,Ft as ee,G as D,Gn as O,Gr as k,Gt as te,H as ne,Hn as re,Hr as ie,Ht as ae,I as oe,In as se,Ir as ce,It as le,J as ue,Jn as de,Jr as fe,Jt as pe,K as me,Kn as he,Kr as ge,Kt as _e,L as ve,Ln as ye,Lr as be,Lt as xe,M as Se,Mn as Ce,Mr as we,Mt as Te,N as Ee,Nn as De,Nr as Oe,Nt as ke,O as Ae,On as je,Or as Me,Ot as Ne,P as Pe,Pn as Fe,Pr as Ie,Pt as Le,Q as Re,Qn as ze,Qr as Be,Qt as Ve,R as He,Rn as Ue,Rr as We,Rt as Ge,S as Ke,Sn as qe,Sr as Je,St as Ye,T as Xe,Tn as Ze,Tr as Qe,Tt as $e,U as A,Un as et,Ur as j,Ut as tt,V as nt,Vn as rt,Vr as M,Vt as it,W as at,Wn as ot,Wr as st,Wt as ct,X as lt,Xn as ut,Xr as dt,Xt as ft,Y as pt,Yn as mt,Yr as ht,Yt as gt,Z as _t,Zn as vt,Zr as yt,Zt as bt,_ as xt,_n as St,_r as Ct,_t as wt,a as Tt,ai as Et,an as Dt,ar as Ot,at as kt,b as At,bn as jt,br as Mt,bt as Nt,c as Pt,cn as Ft,cr as It,ct as Lt,d as Rt,dn as zt,dr as Bt,dt as Vt,ei as Ht,en as Ut,er as Wt,et as Gt,f as Kt,fn as qt,fr as Jt,ft as Yt,g as Xt,gn as Zt,gr as Qt,gt as $t,h as en,hn as tn,hr as nn,ht as rn,i as an,ii as on,in as sn,ir as cn,it as ln,j as un,jn as dn,jr as fn,jt as pn,k as mn,kn as hn,kr as gn,kt as _n,l as vn,ln as yn,lr as bn,lt as xn,m as Sn,mn as Cn,mr as wn,mt as Tn,n as En,ni as N,nn as Dn,nr as On,nt as kn,o as An,on as jn,or as Mn,ot as Nn,p as Pn,pn as Fn,pr as In,pt as Ln,q as Rn,qn as zn,qr as Bn,qt as Vn,r as Hn,ri as Un,rn as Wn,rr as Gn,rt as Kn,s as qn,sn as Jn,sr as Yn,st as Xn,t as Zn,ti as P,tn as Qn,tr as $n,tt as er,u as tr,un as nr,ur as rr,ut as ir,v as ar,vn as or,vr as sr,vt as cr,w as lr,wn as ur,wr as dr,wt as fr,x as pr,xn as mr,xr as hr,xt as gr,y as _r,yn as vr,yr,yt as br,z as xr,zn as Sr,zr as Cr,zt as wr}from"./worker-CRsRc15K.js";
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
const F=M();F.registerFlag(`WEBGPU_DEFERRED_SUBMIT_BATCH_SIZE`,()=>15),F.registerFlag(`WEBGPU_CPU_FORWARD`,()=>!0),F.registerFlag(`WEBGPU_MATMUL_PROGRAM_TYPE`,()=>-1),F.registerFlag(`WEBGPU_USE_NAIVE_CONV2D_TRANSPOSE`,()=>!0),F.registerFlag(`WEBGPU_USE_LOW_POWER_GPU`,()=>!1),F.registerFlag(`WEBGPU_CPU_HANDOFF_SIZE_THRESHOLD`,()=>1e3),F.registerFlag(`WEBGPU_USE_PROFILE_TOOL`,()=>!1),F.registerFlag(`WEBGPU_IMPORT_EXTERNAL_TEXTURE`,()=>!0),F.registerFlag(`WEBGPU_USE_NAIVE_CONV2D_DEBUG`,()=>!1),F.registerFlag(`WEBGPU_THRESHOLD_TO_INCREASE_WORKGROUPS_FOR_MATMUL`,()=>-1),F.registerFlag(`WEBGPU_CONV_SEPARATE_IM2COL_SHADER`,()=>!1),F.registerFlag(`WEBGPU_PRINT_SHADER`,()=>``),F.registerFlag(`WEBGPU_ENGINE_COMPILE_ONLY`,()=>!1);
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Tr=class{constructor(e){e&&(this.vendor=e.vendor,this.architecture=e.architecture,this.intelGPUGeneration=this.getIntelGPUGeneration())}getIntelGPUGeneration(){if(this.isIntel()){if(this.architecture.startsWith(`gen`))return Number(this.architecture.match(/\d+/));if(this.architecture.startsWith(`xe`))return 12}return 0}isIntel(){return this.vendor===`intel`}},Er=class{constructor(e){
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
this.device=e,this.numUsedBuffers=0,this.numFreeBuffers=0,this.freeBuffers=/* @__PURE__ */ new Map,this.usedBuffers=/* @__PURE__ */ new Map,this.numBytesUsed=0,this.numBytesAllocated=0}acquireBuffer(e,t,n=!1,r=!0){let i,a=Dr(e,t);return r?(this.freeBuffers.has(a)||this.freeBuffers.set(a,[]),this.freeBuffers.get(a).length>0?(i=this.freeBuffers.get(a).pop(),this.numFreeBuffers--):(i=this.device.createBuffer({size:e,usage:t,mappedAtCreation:n}),this.numBytesAllocated+=e)):(i=this.device.createBuffer({size:e,usage:t,mappedAtCreation:n}),this.numBytesAllocated+=e),this.usedBuffers.has(a)||this.usedBuffers.set(a,[]),this.usedBuffers.get(a).push(i),this.numUsedBuffers++,this.numBytesUsed+=e,i}releaseBuffer(e,t=!0){if(this.freeBuffers.size===0)return;let n=e.size,r=e.usage,i=Dr(n,r),a=this.usedBuffers.get(i),o=a.indexOf(e);if(o<0)throw Error(`Cannot find the buffer in buffer manager`);a[o]=a[a.length-1],a.pop(),this.numUsedBuffers--,this.numBytesUsed-=n,t?(this.freeBuffers.get(i).push(e),this.numFreeBuffers++):(e.destroy(),this.numBytesAllocated-=n)}getNumUsedBuffers(){return this.numUsedBuffers}getNumFreeBuffers(){return this.numFreeBuffers}dispose(){this.freeBuffers.forEach((e,t)=>{e.forEach(e=>{e.destroy()})}),this.usedBuffers.forEach((e,t)=>{e.forEach(e=>{e.destroy()})}),this.freeBuffers=/* @__PURE__ */ new Map,this.usedBuffers=/* @__PURE__ */ new Map,this.numUsedBuffers=0,this.numFreeBuffers=0,this.numBytesUsed=0,this.numBytesAllocated=0}};function Dr(e,t){return`${e}_${t}`}
/**
* @license
* Copyright 2022 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Or=class{constructor(e){this.device=e,this.numUsedTextures=0,this.numFreeTextures=0,this.freeTextures=/* @__PURE__ */ new Map,this.usedTextures=/* @__PURE__ */ new Map,this.numBytesUsed=0,this.numBytesAllocated=0}acquireTexture(e,t,n,r){let i=Ar(n),a=e*t*i,o=kr(e,t,n,r);if(this.freeTextures.has(o)||this.freeTextures.set(o,[]),this.usedTextures.has(o)||this.usedTextures.set(o,[]),this.numBytesUsed+=a,this.numUsedTextures++,this.freeTextures.get(o).length>0){this.numFreeTextures--;let e=this.freeTextures.get(o).shift();return this.usedTextures.get(o).push(e),e}this.numBytesAllocated+=a;let s=this.device.createTexture({size:[e,t],format:n,usage:r});return this.usedTextures.get(o).push(s),s}releaseTexture(e){if(this.freeTextures.size===0)return;let t=e.width,n=e.height,r=e.format,i=e.usage,a=kr(t,n,r,i);this.freeTextures.has(a)||this.freeTextures.set(a,[]),this.freeTextures.get(a).push(e),this.numFreeTextures++,this.numUsedTextures--;let o=this.usedTextures.get(a),s=o.indexOf(e);if(s<0)throw Error(`Cannot release a texture that was never provided by this texture manager`);o.splice(s,1);let c=Ar(r),l=t*n*c;this.numBytesUsed-=l}getNumUsedTextures(){return this.numUsedTextures}getNumFreeTextures(){return this.numFreeTextures}dispose(){this.freeTextures.forEach((e,t)=>{e.forEach(e=>{e.destroy()})}),this.usedTextures.forEach((e,t)=>{e.forEach(e=>{e.destroy()})}),this.freeTextures=/* @__PURE__ */ new Map,this.usedTextures=/* @__PURE__ */ new Map,this.numUsedTextures=0,this.numFreeTextures=0,this.numBytesUsed=0,this.numBytesAllocated=0}};function kr(e,t,n,r){return`${e}_${t}_${n}_${r}`}function Ar(e){if(e===`rgba8unorm`)return 16;throw Error(`${e} is not supported!`)}
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function jr(e,t){if(Math.max(...e)>5)throw Error(`Cannot symbolically compute strides for rank > 6 tensor.`);let n=e.length,r=e.map(e=>`${t}.${`xyzwuv`[e]}`),i=Array(n-1);i[n-2]=r[n-1];for(let e=n-3;e>=0;--e)i[e]=`(${i[e+1]} * ${r[e+1]})`;return i}const I=(e,t,n)=>n===`int32`?`atomicAdd(${e}, bitcast<i32>(${t}));`:`
          {
            var oldValue = 0;
            loop {
              let newValueF32 = bitcast<f32>(oldValue) + (${t});
              let newValue = bitcast<i32>(newValueF32);
              let res = atomicCompareExchangeWeak(${e}, oldValue, newValue);
              if res.exchanged {
                break;
              }
              oldValue = res.old_value;
            }
          }`;
/**
* @license
* Copyright 2022 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Mr;(function(e){e[e.FROM_PIXELS=0]=`FROM_PIXELS`,e[e.DRAW=1]=`DRAW`})(Mr||={});const Nr=(e,t,n,r,i)=>{let a=Ir(n,{dtype:r.dtype,shape:r.shape},t),o=e.createShaderModule({code:a,label:t.constructor.name}),s=M().get(`WEBGPU_PRINT_SHADER`);if(s!==``){s=s.toLowerCase();let e=s.split(`,`);(s===`all`||e.some(e=>t.shaderKey.toLowerCase().includes(e)))&&(console.group(t.shaderKey),console.debug(a),console.groupEnd())}return i?e.createComputePipelineAsync({compute:{module:o,entryPoint:`_start`},label:t.constructor.name,layout:`auto`}):e.createComputePipeline({compute:{module:o,entryPoint:`_start`},label:t.constructor.name,layout:`auto`})},L=(e,t=`f32`)=>{switch(e){case 1:return`${t}`;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw Error(`${e}-component ${t} is not supported.`)}};function R(e){if(e<=1)return`i32`;if(e===2)return`vec2<i32>`;if(e===3)return`vec3<i32>`;if(e===4)return`vec4<i32>`;if(e===5)return`vec5`;if(e===6)return`vec6`;throw Error(`GPU for rank ${e} is not yet supported`)}function z(e){if(e===0)return`x`;if(e===1)return`y`;if(e===2)return`z`;if(e===3)return`w`;if(e===4)return`u`;if(e===5)return`v`;throw Error(`Index ${e} is not yet supported`)}function B(...e){let t;switch(e.length){case 0:t=`
        fn main()
      `;break;case 1:t=`
        fn main(${e[0]} : i32)
      `;break;default:throw Error(`Unreachable`)}return t}function Pr(e,t){let n;return n=`
     ${Fr(t)}
      fn _start(@builtin(local_invocation_id) LocalId : vec3<u32>,
                @builtin(global_invocation_id) GlobalId : vec3<u32>,
                @builtin(local_invocation_index) LocalIndex: u32,
                @builtin(workgroup_id) WorkgroupId : vec3<u32>,
                @builtin(num_workgroups) NumWorkgroups : vec3<u32>) {
        localId = LocalId;
        localIndex = LocalIndex;
        globalId = GlobalId;
        numWorkgroups = NumWorkgroups;
        workgroupId = WorkgroupId;
        ${e?`main(getGlobalIndex());`:`main();`};
      }
    `,n}function Fr(e){return`
  @compute @workgroup_size(${e.workgroupSize[0]}, ${e.workgroupSize[1]}, ${e.workgroupSize[2]})
`}function Ir(e,t,n){let r=[],i=n.workgroupSize[0]*n.workgroupSize[1]*n.workgroupSize[2];if(n.outputComponent=n.outputComponent?n.outputComponent:1,r.push(`

      var<private> localId: vec3<u32>;
      var<private> localIndex: u32;
      var<private> globalId: vec3<u32>;
      var<private> numWorkgroups: vec3<u32>;
      var<private> workgroupId: vec3<u32>;

      // Only used when the y/z dimension of workgroup size is 1.
      fn getGlobalIndex() -> i32 {
        ${Kr(n)?`  return i32(globalId.x);`:`  return i32((workgroupId.z * numWorkgroups.x * numWorkgroups.y +
                workgroupId.y * numWorkgroups.x + workgroupId.x) * ${i}u +
                localIndex);
        `}
      }
    `),n.pixelsOpType!=null){let i=n.pixelsOpType===Mr.FROM_PIXELS?`@group(0) @binding(0) var<storage, read_write> result: array<${V(t.dtype,n.outputComponent)}>;`:`@group(0) @binding(1) var<storage, read> inBuf : array<${V(e[0].dtype,n.outputComponent)}>;`,a=t.shape.length===3?`vec2<i32>`:`i32`;r.push(`
        struct Uniform {
          outShapeStrides : ${a},
          size            : i32,
          numChannels     : i32,
          alpha           : f32,
        };

        ${i}
        @group(0) @binding(2) var<uniform> uniforms: Uniform;
      `);let o=Yr(n);return[Rr,r.join(`
`),Br(t.shape),n.getUserCode(),Pr(o,n)].join(`
`)}let a,o,s=`struct Uniforms { NAN : f32, INFINITY : f32, `;n.variableNames.forEach((t,n)=>{let r=R(e[n].shape.length);s+=`${t.charAt(0).toLowerCase()+t.slice(1)}Shape : ${r}, `,a=e[n].shape.length-1,o=R(a),s+=`${t.charAt(0).toLowerCase()+t.slice(1)}ShapeStrides: ${o}, `});let c=R(t.shape.length);s+=`outShape : ${c}, `,a=t.shape.length-1,o=R(a),s+=`
         outShapeStrides: ${o}, `,n.size&&(s+=`size : i32, `),n.uniforms&&(s+=n.uniforms),s+=`};`,s=Jr(s),r.push(s),n.atomic?r.push(`
      @group(0) @binding(0) var<storage, read_write> result: array<atomic<i32>>;
    `):r.push(`
      @group(0) @binding(0) var<storage, read_write> result: array<${V(t.dtype,n.outputComponent)}>;
    `),n.variableNames.forEach((t,i)=>{r.push(`
      @group(0) @binding(${1+i}) var<storage, read> ${t}: array<${n.variableComponents?V(e[i].dtype,n.variableComponents[i]):V(e[i].dtype,n.outputComponent)}>;
        `)}),s!==``&&r.push(`
      @group(0) @binding(${1+n.variableNames.length}) var<uniform> uniforms: Uniforms;
      `);let l=Wr(t.shape,n.dispatchLayout),u=[Rr,r.join(`
`)+zr,Br(t.shape),l,Gr(t.shape.length)];n.atomic||u.push(qr(t.shape,t.dtype,n.outputComponent)),n.variableNames.forEach((t,n)=>{u.push(`${Br(e[n].shape,t)}`)});let d=e.map((e,r)=>Ur(e,t.shape,n.variableComponents?n.variableComponents[r]:n.outputComponent,n.dispatchLayout.x.length===t.shape.length)).join(`
`);u.push(d),u.push(n.getUserCode());let f=Yr(n);return u.push(Pr(f,n)),u.join(`
`)}function Lr(e,t,n){let r=e.shaderKey;if(e.pixelsOpType!=null)return r;let i=[],a=[];t.forEach(e=>{i.push(e.shape),a.push(e.dtype)}),i.push(n.shape),a.push(n.dtype);let o=t.map(e=>at(e.shape,n.shape)),s=t.map(e=>ie(e.shape,n.shape)).join(`_`),c=o.map(e=>e.join(`_`)).join(`;`),l=Kr(e)?`flatDispatch`:``;return r+=`_`+(e.workgroupSize?e.workgroupSize.join(`,`):``)+i.map(e=>e.length).join(`,`)+a.join(`,`)+e.variableNames.join(`,`)+c+s+l,r}const Rr=`
  struct vec5 {x: i32, y: i32, z: i32, w: i32, u: i32};
  struct vec6 {x: i32, y: i32, z: i32, w: i32, u: i32, v: i32};

  // Checks whether coordinates lie within the bounds of the shape.
  fn coordsInBounds2D(coord : vec2<i32>, shape : vec2<i32>) -> bool {
    return all(coord >= vec2<i32>(0)) && all(coord < shape);
  }
  fn coordsInBounds3D(coord : vec3<i32>, shape : vec3<i32>) -> bool {
    return all(coord >= vec3<i32>(0)) && all(coord < shape);
  }
  fn coordsInBounds4D(coord : vec4<i32>, shape : vec4<i32>) -> bool {
    return all(coord >= vec4<i32>(0)) && all(coord < shape);
  }

  fn getIndexFromCoords1D(coord : i32, shape : i32) -> i32 {
    return coord;
  }
  fn getIndexFromCoords2D(coords : vec2<i32>, shape : vec2<i32>) -> i32 {
    return dot(coords, vec2<i32>(shape.y, 1));
  }
  fn getIndexFromCoords3D(coords : vec3<i32>, shape : vec3<i32>) -> i32 {
    return dot(coords, vec3<i32>(shape.y * shape.z, shape.z, 1));
  }
  fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
    return dot(coords, vec4<i32>(
        shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
  }
  fn getIndexFromCoords5D(coords : vec5, shape : vec5) -> i32 {
    let shapeStrides: vec5 = vec5(shape.y * shape.z * shape.w * shape.u, shape.z * shape.w * shape.u, shape.w * shape.u, shape.u, 1);
    return coords.x*shapeStrides.x + coords.y*shapeStrides.y + coords.z*shapeStrides.z + coords.w*shapeStrides.w + coords.u*shapeStrides.u;
  }
  fn getIndexFromCoords6D(coords : vec6, shape : vec6) -> i32 {
    let shapeStrides: vec6 = vec6(shape.y * shape.z * shape.w * shape.u * shape.v, shape.z * shape.w * shape.u * shape.v, shape.w * shape.u * shape.v, shape.u * shape.v, shape.v, 1);
    return coords.x*shapeStrides.x + coords.y*shapeStrides.y + coords.z*shapeStrides.z + coords.w*shapeStrides.w + coords.u*shapeStrides.u + coords.v*shapeStrides.v;
  }

  // NaN defination in IEEE 754-1985 is :
  //   - sign = either 0 or 1.
  //   - biased exponent = all 1 bits.
  //   - fraction = anything except all 0 bits (since all 0 bits represents infinity).
  // https://en.wikipedia.org/wiki/IEEE_754-1985#Representation_of_non-numbers
  fn isnan(val: f32) -> bool {
    let floatToUint: u32 = bitcast<u32>(val);
    return (floatToUint & 0x7fffffffu) > 0x7f800000u;
  }
  fn isnanVec4(val : vec4<f32>) -> vec4<bool> {
    let floatToUint: vec4<u32> = bitcast<vec4<u32>>(val);
    return (floatToUint & vec4<u32>(0x7fffffffu)) > vec4<u32>(0x7f800000u);
  }
`,zr=`
  fn isinf(val: f32) -> bool {
    return abs(val) == uniforms.INFINITY;
  }
`;function Br(e,t=``){let n=e.length,r=t===``?`getCoordsFromIndex`:`get${t.charAt(0).toUpperCase()+t.slice(1)}CoordsFromIndex`,i=t===``?`outShapeStrides`:`${t.charAt(0).toLowerCase()+t.slice(1)}ShapeStrides`;if(n<=1)return`fn ${r}(index : i32) -> i32 { return index; }`;let a=k(e),o=R(n),s=[];for(let e=0;e<n;e++)s.push(`d${e}`);if(a.length===1)return`    fn ${r}(index : i32) -> vec2<i32> {
      let d0 = index / uniforms.${i}; let d1 = index - d0 * uniforms.${i};
      return vec2<i32>(d0, d1);
    }`;let c;return c=`var index2 = index;`+a.map((e,t)=>`${`let ${s[t]} = index2 / uniforms.${i}.${z(t)}`}; ${t===a.length-1?`let ${s[t+1]} = index2 - ${s[t]} * uniforms.${i}.${z(t)}`:`index2 = index2 - ${s[t]} * uniforms.${i}.${z(t)}`};`).join(``),`
    fn ${r}(index : i32) -> ${o} {
      ${c}
      return ${o}(${s.join(`,`)});
    }
  `}function Vr(e,t){let n=e.name,r=e.shape.length,i=R(r),a=`get`+n.charAt(0).toUpperCase()+n.slice(1),o=[`d0`,`d1`,`d2`,`d3`,`d4`,`d5`].slice(0,r),s=o.map(e=>`${e} : i32`).join(`, `);if(r<1)return`
      fn ${a}() -> ${L(t)} {
        return ${L(t)}(${n}[0]);
      }
    `;let c=`uniforms.${n.charAt(0).toLowerCase()+n.slice(1)}Shape`,l=`${r}D`;return r===0&&(l=`1D`),`
    fn ${a}(${s}) -> ${L(t)} {
      return ${L(t)}(${n}[getIndexFromCoords${l}(${i}(${o.join(`,`)}),
        ${c})${t===1?``:` / ${t}`}]);
    }
   `}function Hr(e,t,n,r){let i=e.name,a=i.charAt(0).toUpperCase()+i.slice(1),o=`get`+a+`ByOutput`,s=e.shape.length,c=t.length,l=R(c);if(ie(e.shape,t)&&r)return`
    fn ${o}Index(globalIndex : i32) -> ${L(n)} {
      return ${L(n)}(${i}[globalIndex]);
    }

    fn ${o}Coords(coords : ${l}) -> ${L(n)} {
      return ${L(n)}(${i}[${c>1?`getOutputIndexFromCoords(coords)`:`coords`}${n===1?``:` / ${n}`}]);
    }
    `;let u=at(e.shape,t),d=c-s,f=``;if(s===0)return`
    fn ${o}Index(globalIndex : i32) -> ${L(n)}{
      return get${a}();
    }

    fn ${o}Coords(coords : ${l}) -> ${L(n)}{
      return get${a}();
    }
  `;f=c<2&&u.length>=1?`coords = 0;`:u.map(e=>`coords.${z(e+d)} = 0;`).join(`
`);let p=``;p=c<2&&s>0?`coords`:c>1?`${R(s)}(${e.shape.map((e,t)=>`coords.${z(t+d)}`).join(`, `)})`:`coords`;let m=`uniforms.${i.charAt(0).toLowerCase()+i.slice(1)}Shape`,h=`${s}D`;return`
  fn ${o}Index(globalIndex : i32) -> ${L(n)} {
    var coords = getCoordsFromIndex(globalIndex);
    ${f}
    return ${L(n)}(${i}[getIndexFromCoords${h}(${p}, ${m})${n===1?``:` / ${n}`}]);
  }

  fn ${o}Coords(coordsIn : ${l}) -> ${L(n)} {
    var coords = coordsIn;
    ${f}
    return ${L(n)}(${i}[getIndexFromCoords${h}(${p}, ${m})${n===1?``:` / ${n}`}]);
  }
`}function Ur(e,t,n,r){let i=Vr(e,n);return e.shape.length<=t.length&&(i+=Hr(e,t,n,r)),i}function Wr(e,t){let{x:n,y:r=[],z:i=[]}=t,a=e.length,o=n.length+r.length+i.length;if(o!==a)return``;if(n.length===a)return`fn getOutputCoords() -> ${R(a)}{
    let globalIndex = getGlobalIndex();
    return getCoordsFromIndex(globalIndex);
  }
  `;let s=``,c=[n,r,i];for(let e=0;e<c.length;e++){let t=c[e];if(t.length!==0){if(t.length===1)s+=`let d${t[0]} = i32(globalId[${e}]);`;else{let n=jr(t,`uniforms.outShape`);s+=`var index${e} = i32(globalId[${e}]);`;for(let r=0;r<n.length;r++)s+=`let d${t[r]} = index${e} / ${n[r]};`,r===n.length-1?s+=`let d${t[r+1]} = index${e} - d${t[r]} * ${n[r]};`:s+=`index${e} = index${e} - d${t[r]} * ${n[r]};`}}}let l=[];for(let e=0;e<o;e++)l.push(`d${e}`);let u=R(o),d=`fn getOutputCoords() -> ${u} {
  ${s}
`;return l.length===0?d+=`return ${u}(0); }`:d+=`return ${u}(${l.join(`,`)}); }`,d}function Gr(e){let t=``;switch(e){case 0:case 1:t+=`
        fn getOutputIndexFromCoords(coords : i32) -> i32 {
          return coords;
        }
        `;break;case 2:t+=`
        fn getOutputIndexFromCoords(coords : vec2<i32>) -> i32 {
          return dot(coords, vec2<i32>(uniforms.outShapeStrides, 1));
        }
        `;break;case 3:t+=`
        fn getOutputIndexFromCoords(coords : vec3<i32>) -> i32 {
          return dot(coords, vec3<i32>(uniforms.outShapeStrides.x, uniforms.outShapeStrides.y, 1));
        }
        `;break;case 4:t+=`
        fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
          return dot(coords, vec4<i32>(
            uniforms.outShapeStrides.x, uniforms.outShapeStrides.y, uniforms.outShapeStrides.z, 1));
        }
        `;break;case 5:t+=`
        fn getOutputIndexFromCoords(coords : vec5) -> i32 {
          return coords.x * uniforms.outShapeStrides.x +
              coords.y * uniforms.outShapeStrides.y +
              coords.z * uniforms.outShapeStrides.z +
              coords.w * uniforms.outShapeStrides.w +
              coords.u;
        }
        `;break;case 6:t+=`
        fn getOutputIndexFromCoords(coords : vec6) -> i32 {
          return coords.x * uniforms.outShapeStrides.x +
              coords.y * uniforms.outShapeStrides.y +
              coords.z * uniforms.outShapeStrides.z +
              coords.w * uniforms.outShapeStrides.w +
              coords.u * uniforms.outShapeStrides.u +
              coords.v;
        }
        `;break;default:j(!1,()=>`Unsupported ${e}D shape`)}return t}function Kr(e){return e.dispatch[1]===1&&e.dispatch[2]===1}function V(e,t=1){if(e===`float32`)return L(t,`f32`);if(e===`int32`||e===`bool`)return L(t,`i32`);throw Error(`type ${e} is not supported.`)}function qr(e,t,n){let r=e.length,i=V(t,n),a=`fn setOutputAtIndex(flatIndex : i32, value : ${L(n)}) {
      result[flatIndex] = ${i}(value);
    }

    fn setOutputAtIndexI32(flatIndex : i32, value : ${L(n,`i32`)}) {
      result[flatIndex] = ${i}(value);
    }
    `;if(r>=2){let e=[`d0`,`d1`,`d2`,`d3`,`d4`,`d5`].slice(0,r),t=R(r);a+=`
      fn setOutputAtCoords(${e.map(e=>`${e} : i32`).join(`, `)}, value : ${L(n)}) {
        let flatIndex = getOutputIndexFromCoords(${t}(${e.join(`, `)}));
        setOutputAtIndex(flatIndex${n===1?``:` / ${n}`}, value);
      }
      fn setOutputAtCoordsI32(${e.map(e=>`${e} : i32`).join(`, `)}, value : ${L(n,`i32`)}) {
        let flatIndex = getOutputIndexFromCoords(${t}(${e.join(`, `)}));
        setOutputAtIndexI32(flatIndex${n===1?``:` / ${n}`}, value);
      }
    `}return a}function Jr(e){return e=e.replace(/(\w+)\s*:\s*vec(5|6)/g,e=>`@align(16) `+e),e=e.replace(/vec(5|6)\s*,\s*(\w+)/g,(e,t,n)=>`vec${t}, @align(16) ${n}`),e}function Yr(e){return!(e.dispatchLayout.hasOwnProperty(`y`)&&e.dispatchLayout.y.length!==0||e.dispatchLayout.hasOwnProperty(`z`)&&e.dispatchLayout.z.length!==0)}
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
const Xr=e=>{let t=1;for(let n=0;n<e.length;n++)t*=e[n];return t};function H(e,t,n=[1,1,1],r=[1,1,1]){let[i,a,o]=[Math.ceil(Xr(e.x.map(e=>t[e]))/(n[0]*r[0])),e.y?Math.ceil(Xr(e.y.map(e=>t[e]))/(n[1]*r[1])):1,e.z?Math.ceil(Xr(e.z.map(e=>t[e]))/(n[2]*r[2])):1];return[i,a,o]}function Zr(e,t,n,r=!1){let i=[8,8,1],a=[4,4,1];return r||(e<=8&&(a[1]=1),t<=16&&n<=16&&(i[0]=4)),{workgroupSize:i,elementsPerThread:a}}function Qr(e,t,n=!1){if(n)return[8,8,1];let r=Xr(e.x.map(e=>t[e])),i=Xr(e.y.map(e=>t[e]));return r<=4?[4,16,1]:i<=4?[16,4,1]:[16,16,1]}function $r(e,t,n=!1){if(n)return[4,4,1];let r=Xr(e.x.map(e=>t[e])),i=Xr(e.y.map(e=>t[e]));return r<=4?[1,2,1]:i<=4?[2,1,1]:[2,2,1]}function U(e){return{x:e.map((e,t)=>t)}}function ei(e){if(e===`float32`||e===`int32`||e===`bool`||e===`string`)return 4;if(e===`complex64`)return 8;throw Error(`Unknown dtype ${e}`)}function ti(){return!!(typeof globalThis<`u`&&globalThis.navigator&&globalThis.navigator.gpu)}function ni(e,t){Array.isArray(e)||(e=[e]),e.forEach(e=>{e!=null&&j(e.dtype!==`complex64`,()=>`${t} does not support complex64 tensors in the WebGPU backend.`)})}var W;(function(e){e[e.MatMulReduceProgram=0]=`MatMulReduceProgram`,e[e.MatMulSplitKProgram=1]=`MatMulSplitKProgram`,e[e.MatMulSmallOutputSizeProgram=2]=`MatMulSmallOutputSizeProgram`,e[e.MatMulPackedProgram=3]=`MatMulPackedProgram`,e[e.MatMulMax=4]=`MatMulMax`})(W||={});
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
const ri=M().getNumber(`WEBGPU_CPU_HANDOFF_SIZE_THRESHOLD`),ii=(e,t)=>{let n=e.limits.maxComputeWorkgroupsPerDimension,r=t.dispatchLayout,i=t.dispatch;if(i.every(e=>e<=n))return i;j(i[0]>n&&r.y===void 0&&r.z===void 0,()=>`Dispatch size exceeds WebGPU limits in Y or Z dimension.`);let a=Math.ceil(Math.sqrt(i[0]));return a>n?(a=Math.ceil(Math.cbrt(i[0])),j(a<=n,()=>`Total dispatch size exceeds WebGPU maximum.`),[a,a,a]):[a,a,1]};var ai=class t extends Et{nextDataId(){return t.nextDataId++}constructor(t,n){if(super(),this.commandQueueOwnedIds=/* @__PURE__ */ new WeakSet,this.dispatchCountInPass=0,this.disposed=!1,this.downloadWaitMs=0,this.tensorDataPendingDisposal=[],this.queryResolveBuffer=null,this.querySet=null,this.querySetCount=2,this.stagingPendingDisposal=[],this.uniformPendingDisposal=[],this.uploadWaitMs=0,this.hasReadSyncWarned=!1,this.hasTimestampQueryWarned=!1,!ti())throw Error(`WebGPU is not supported on this device`);this.pipelineCache={},this.device=t,this.queue=t.queue,this.commandEncoder=null,this.computePassEncoder=null,this.adapterInfo=new Tr(n),this.supportTimestampQuery=this.device.features.has(`timestamp-query`),this.thresholdToIncreaseWorkgroups=this.adapterInfo.intelGPUGeneration>=12?16:8,this.bufferManager=new Er(this.device),this.textureManager=new Or(this.device),this.tensorMap=new on(this,e()),M().getBool(`WEBGPU_USE_PROFILE_TOOL`)&&(this.dummyCanvas=document.createElement(`canvas`),this.dummyCanvas.width=1,this.dummyCanvas.height=1,this.dummyContext=this.dummyCanvas.getContext(`webgpu`),this.dummyContext.configure({device:t,format:`bgra8unorm`}),document.body.appendChild(this.dummyCanvas))}floatPrecision(){return 32}disposeData(e,t=!1){if(!this.tensorMap.has(e))return!0;let n=this.tensorMap.get(e);return t?n.refCount=0:n.refCount--,n.refCount>0?!1:(n.complexTensorInfos!=null&&(this.disposeData(n.complexTensorInfos.real.dataId),this.disposeData(n.complexTensorInfos.imag.dataId)),this.commandQueueOwnedIds.has(e)?(this.tensorDataPendingDisposal.push(e),!0):(this.releaseResource(e),this.tensorMap.delete(e),!0))}memory(){return{numBytesInGPU:this.bufferManager.numBytesUsed,numBytesAllocatedInGPU:this.bufferManager.numBytesAllocated,unreliable:!1}}releaseResource(e){let t=this.tensorMap.get(e);if(t&&t.resource){if(t.external){t.resource=null;return}t.resource instanceof GPUBuffer?this.bufferManager.releaseBuffer(t.resource):t.resource instanceof GPUTexture&&this.textureManager.releaseTexture(t.resource),t.resource=null}}refCount(e){return this.tensorMap.has(e)?this.tensorMap.get(e).refCount:0}incRef(e){let t=this.tensorMap.get(e);t.refCount++}decRef(e){if(this.tensorMap.has(e)){let t=this.tensorMap.get(e);t.refCount--}}write(e,t,n){if(n===`complex64`&&e!=null)throw Error(`Cannot write to a complex64 dtype. Please use tf.complex(real, imag).`);let r={id:this.nextDataId()};return this.tensorMap.set(r,{dtype:n,shape:t,values:e,refCount:1}),r}move(e,t,n,r,i){if(r===`complex64`)throw Error(`Cannot write to a complex64 dtype. Please use tf.complex(real, imag).`);this.tensorMap.set(e,{dtype:r,shape:n,values:t,refCount:i})}submitQueue(){this.queue.submit([this.commandEncoder.finish()]),this.commandEncoder=null,this.dispatchCountInPass=0,this.commandQueueOwnedIds=/* @__PURE__ */ new WeakSet,this.tensorDataPendingDisposal.forEach(e=>{this.releaseResource(e),this.tensorMap.delete(e)}),this.uniformPendingDisposal.forEach(e=>this.bufferManager.releaseBuffer(e)),this.stagingPendingDisposal.forEach(e=>this.bufferManager.releaseBuffer(e,!1)),this.tensorDataPendingDisposal=[],this.uniformPendingDisposal=[],this.stagingPendingDisposal=[]}ensureCommandEncoderReady(){this.commandEncoder||=this.device.createCommandEncoder()}endComputePassEncoder(){this.computePassEncoder&&=(this.computePassEncoder.end(),null)}async checkCompileCompletionAsync(){let e;try{e=await Promise.all(Object.values(this.pipelineCache))}catch(e){throw Error(e.message)}Object.keys(this.pipelineCache).map((t,n)=>{this.pipelineCache[t]=e[n]})}async getBufferData(e){if(M().getBool(`WEBGPU_ENGINE_COMPILE_ONLY`))return console.warn(`The data may be invalid since WEBGPU_ENGINE_COMPILE_ONLY is true, this can only be called when WEBGPU_ENGINE_COMPILE_ONLY is false`),null;let t=e.size,n=this.bufferManager.acquireBuffer(t,GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ);this.ensureCommandEncoderReady(),this.endComputePassEncoder(),this.commandEncoder.copyBufferToBuffer(e,0,n,0,t),this.submitQueue(),await n.mapAsync(GPUMapMode.READ);let r=n.getMappedRange().slice(0);return n.unmap(),n!=null&&this.bufferManager.releaseBuffer(n),M().getBool(`WEBGPU_USE_PROFILE_TOOL`)&&(j(this.dummyContext!==void 0,()=>`Fail to get context for profiling tool`),this.dummyContext.getCurrentTexture()),r}convertAndCacheOnCPU(e,t){let n=this.tensorMap.get(e);return n.values=t,n.values}readSync(e){let t=this.tensorMap.get(e),{values:n,complexTensorInfos:r}=t;if(n!=null||t.dtype===`string`)return n;if(t.dtype===`complex64`){let t=this.readSync(r.real.dataId),n=this.readSync(r.imag.dataId),i=ge(Rt(t,n).buffer,`float32`);return this.convertAndCacheOnCPU(e,i),i}this.hasReadSyncWarned||(this.hasReadSyncWarned=!0,console.warn(`The performance of synchronously reading data from GPU to CPU is poor on the webgpu backend, please use asynchronous APIs instead.`));let i=[`opaque`,`premultiplied`],a=t.resource,o=a.size;j(o%4==0,()=>`Because there is 4 bytes for one pixel, buffer size must be multiple of 4.`);let s=o/4,c=new ArrayBuffer(o),l=i.map(e=>new OffscreenCanvas(256,256)),u=new OffscreenCanvas(256,256);this.endComputePassEncoder(),l.map((e,t)=>{let n=e.getContext(`webgpu`);return n.configure({device:this.device,format:`bgra8unorm`,usage:GPUTextureUsage.COPY_DST,alphaMode:i[t]}),n.getCurrentTexture()}).map((e,t)=>{let n=(n,r,o)=>{this.ensureCommandEncoderReady(),this.commandEncoder.copyBufferToTexture({buffer:a,bytesPerRow:1024,offset:o},{texture:e},{width:n,height:r}),this.submitQueue();let s=u.getContext(`2d`,{willReadFrequently:!0});s.clearRect(0,0,n,r),s.drawImage(l[t],0,0);let d=s.getImageData(0,0,n,r).data,f=i[t],p=new Uint8ClampedArray(c,o,n*r*4);for(let e=0;e<p.length;e+=4)if(f===`premultiplied`)p[e+3]=d[e+3];else{let t=d[e];p[e]=d[e+2],p[e+1]=d[e+1],p[e+2]=t}},r=Math.floor(s/65536),o=256,d=256,f=0;for(let e=0;e<r;e++)n(o,d,f),f+=262144;let p=s%65536;d=Math.floor(p/256),d>0&&(n(o,d,f),f+=d*1024),o=p%256,o>0&&n(o,1,f)});let d=ge(c,t.dtype);return this.convertAndCacheOnCPU(e,d),d}async read(e){if(!this.tensorMap.has(e))throw Error(`Tensor ${e} was not registered!`);let t=this.tensorMap.get(e),{values:n}=t;if(n!=null)return n;let r;if(t.dtype===`complex64`){let e=await Promise.all([this.read(t.complexTensorInfos.real.dataId),this.read(t.complexTensorInfos.imag.dataId)]),n=e[0],i=e[1];r=Rt(n,i)}else{let e=await this.getBufferData(t.resource);r=ge(e,t.dtype)}return this.convertAndCacheOnCPU(e,r),r}copyBuffer(e){let t=e.size,n=e.usage,r=this.bufferManager.acquireBuffer(t,n);return this.ensureCommandEncoderReady(),this.endComputePassEncoder(),this.commandEncoder.copyBufferToBuffer(e,0,r,0,t),this.submitQueue(),r}createTensorFromGPUData(t,n,r){let i=t.buffer;if(r===`complex64`)throw Error(`Cannot write to a complex64 dtype. `);let a={id:this.nextDataId()};this.tensorMap.set(a,{dtype:r,shape:n,values:null,refCount:1,external:t.zeroCopy});let o=this.tensorMap.get(a),s=ei(o.dtype)*N(o.shape);if(t.buffer.size<s)throw Error(`GPUBuffer size(${t.buffer.size}) is smaller than tensor size(${s})!`);if((t.buffer.usage&(GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC))!==(GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC))throw Error(`GPUBuffer.usage should include GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC!`);return t.zeroCopy!==!0&&(i=this.copyBuffer(i)),o.resource=i,e().makeTensorFromDataId(a,n,r,this)}readToGPU(t){let{values:n,dtype:r,shape:i,resource:a}=this.tensorMap.get(t);if(r===`complex64`)throw Error(`Does not support reading buffer for complex64 dtype.`);if(a==null)throw Error(n==null?`There is no data on GPU or CPU.`:`Data is not on GPU but on CPU.`);let o=a,s=o.size,c=o.usage,l=this.bufferManager.acquireBuffer(s,c);this.ensureCommandEncoderReady(),this.endComputePassEncoder(),this.commandEncoder.copyBufferToBuffer(a,0,l,0,s),this.submitQueue();let u=this.makeTensorInfo(i,r),d=e().makeTensorFromTensorInfo(u),f=this.tensorMap.get(u.dataId);return f.resource=l,{tensorRef:d,buffer:l}}bufferSync(e){let t=this.readSync(e.dataId);if(e.dtype===`string`)try{let n=t.map(e=>Kn(e));return Re(e.shape,e.dtype,n)}catch{throw Error(`Failed to decode encoded string bytes into utf-8`)}return Re(e.shape,e.dtype,t)}async time(e){!this.supportTimestampQuery&&!this.hasTimestampQueryWarned&&(console.warn(`This device doesn't support timestamp-query extension. Start Chrome browser with flag --enable-dawn-features=allow_unsafe_apis to try it again. Otherwise, zero will be shown for the kernel time when profiling mode is enabled.`),this.hasTimestampQueryWarned=!0);let t=this.activeTimers,n=[],r=!1;this.programTimersStack==null?(this.programTimersStack=n,r=!0):this.activeTimers.push(n),this.activeTimers=n,e();let i=kt(this.activeTimers.map(e=>e.query)).filter(e=>e!=null),a=kt(this.activeTimers.map(e=>e.name)).filter(e=>e!=null);this.activeTimers=t,r&&(this.programTimersStack=null);let o={uploadWaitMs:this.uploadWaitMs,downloadWaitMs:this.downloadWaitMs,kernelMs:null,wallMs:null},s=await Promise.all(i);return o.kernelMs=Un(s),o.getExtraProfileInfo=()=>s.map((e,t)=>({name:a[t],ms:e})).map(e=>`${e.name}: ${e.ms}`).join(`, `),this.uploadWaitMs=0,this.downloadWaitMs=0,o}makeTensorInfo(e,t,r){return t===`string`&&r!=null&&r.length>0&&n(r[0])&&(r=r.map(e=>ln(e))),{dataId:this.write(r,e,t),shape:e,dtype:t}}tensorToBinding(e){if(!e)return null;let t=this.tensorMap.get(e.dataId).resource;return t instanceof GPUBuffer?{buffer:t}:t instanceof GPUTexture?t.createView():t}uploadToGPU(e){let t=this.tensorMap.get(e);if(t.resource!=null)return;let n=ei(t.dtype)*N(t.shape),r,i=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST;if(t.values){if(r=this.bufferManager.acquireBuffer(n,i,!0),r.mapState===`unmapped`){let e=this.bufferManager.acquireBuffer(n,GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC,!0,!1),i=e.getMappedRange();t.dtype===`int32`||t.dtype===`bool`?new Int32Array(i).set(t.values):new Float32Array(i).set(t.values),e.unmap(),this.ensureCommandEncoderReady(),this.endComputePassEncoder(),this.commandEncoder.copyBufferToBuffer(e,0,r,0,n),this.stagingPendingDisposal.push(e)}else{let e=r.getMappedRange();t.dtype===`int32`||t.dtype===`bool`?new Int32Array(e).set(t.values):new Float32Array(e).set(t.values),r.unmap()}t.values=null}else r=this.bufferManager.acquireBuffer(n,i);t.resource=r}makeUniforms(e){let t=0,n=0,r=[],i=1;e.forEach(e=>{e.data.length===0&&(e.data=[1]);let a;switch(e.data.length){case 1:a=4;break;case 2:a=8;break;case 3:a=16;break;case 4:a=16;break;case 5:a=16;break;case 6:a=16;break;default:j(!1,()=>`Unsupported ${e.data.length}D shape`)}(n===5||n===6)&&(a=16),a>i&&(i=a),t=Math.ceil(t/a)*a,n=e.data.length,r.push(t),t+=e.data.length*4}),t=Math.ceil(t/i)*i;let a=new ArrayBuffer(t);e.forEach((e,t)=>{let n=r[t];e.type===`int32`?new Int32Array(a,n,e.data.length).set(e.data):e.type===`uint32`?new Uint32Array(a,n,e.data.length).set(e.data):new Float32Array(a,n,e.data.length).set(e.data)});let o=this.bufferManager.acquireBuffer(t,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);return this.queue.writeBuffer(o,0,a,0,t),this.uniformPendingDisposal.push(o),{offset:0,size:t,buffer:o}}runWebGPUProgram(e,t,n,r,i){if(i||=this.makeTensorInfo(e.outputShape,n),N(i.shape)===0)return this.tensorMap.get(i.dataId).values=fe(i.dtype,0),i;this.uploadToGPU(i.dataId),e.dispatch=ii(this.device,e);let a=t.map((t,n)=>{if(t.dtype===`complex64`)throw Error(`GPGPUProgram does not support complex64 input. For complex64 dtypes, please separate the program into real and imaginary parts.`);return this.uploadToGPU(t.dataId),{dtype:this.tensorMap.get(t.dataId).dtype,shape:t.shape,name:e.variableNames[n]}});e.shaderKey=Lr(e,a,i);let o=M().getBool(`WEBGPU_ENGINE_COMPILE_ONLY`);return e.shaderKey in this.pipelineCache||(this.pipelineCache[e.shaderKey]=Nr(this.device,e,a,i,o)),e.pipeline=this.pipelineCache[e.shaderKey],o||this.recordAndSubmit(e,i,t,r),i}recordAndSubmit(e,t,n,r){if(e.pipeline instanceof Promise)throw Error(`Please call checkCompileCompletionAsync to ensure parallel compilation is done!`);let i=[],a=[],o=`int32`;if(e.pixelsOpType==null){i.push({type:`float32`,data:[NaN]},{type:`float32`,data:[1/0]}),a=n.concat(t).map(e=>e.shape);let e=`int32`;a.map(t=>{i.push({type:e,data:t});let n=k(t);i.push({type:e,data:n})})}else{let e=k(t.shape);i.push({type:o,data:e})}if(e.size){let t=N(e.outputShape);i.push({type:o,data:[e.outputComponent?t/e.outputComponent:t]})}r&&(i=[...i,...r]);let s=[this.tensorToBinding(t),...n.map(e=>this.tensorToBinding(e)),this.makeUniforms(i)];n.forEach(e=>{this.commandQueueOwnedIds.add(e.dataId)}),this.commandQueueOwnedIds.add(t.dataId);let c=this.device.createBindGroup({layout:e.pipeline.getBindGroupLayout(0),entries:s.map((e,t)=>({binding:t,resource:e}))}),l=this.activeTimers!=null;this.ensureCommandEncoderReady();let u={};l&&this.supportTimestampQuery?(this.endComputePassEncoder(),this.querySet??=this.device.createQuerySet({type:`timestamp`,count:this.querySetCount}),u.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1},this.computePassEncoder=this.commandEncoder.beginComputePass(u)):this.computePassEncoder||=this.commandEncoder.beginComputePass(u),this.computePassEncoder.setPipeline(e.pipeline),this.computePassEncoder.setBindGroup(0,c),this.computePassEncoder.dispatchWorkgroups(e.dispatch[0],e.dispatch[1],e.dispatch[2]),this.dispatchCountInPass++,(l||M().get(`WEBGPU_DEFERRED_SUBMIT_BATCH_SIZE`)<=this.dispatchCountInPass||e.pixelsOpType===Mr.DRAW)&&(this.endComputePassEncoder(),l?this.activeTimers.push({name:e.constructor.name,query:this.getQueryTime()}):this.submitQueue())}async getQueryTime(){if(!this.supportTimestampQuery)return 0;this.queryResolveBuffer??=this.bufferManager.acquireBuffer(this.querySetCount*8,GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST|GPUBufferUsage.QUERY_RESOLVE),this.commandEncoder.resolveQuerySet(this.querySet,0,this.querySetCount,this.queryResolveBuffer,0);let e=this.bufferManager.acquireBuffer(this.querySetCount*8,GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST);this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.querySetCount*8),this.submitQueue(),await e.mapAsync(GPUMapMode.READ);let t=new BigUint64Array(e.getMappedRange()),n=Number(t[1]-t[0])/1e6;return e.unmap(),this.bufferManager.releaseBuffer(e),n}shouldExecuteOnCPU(e,t=ri){return M().getBool(`WEBGPU_CPU_FORWARD`)&&e.every(e=>this.tensorMap.get(e.dataId).resource==null&&N(e.shape)<t)}numDataIds(){return this.tensorMap.numDataIds()-this.tensorDataPendingDisposal.length}dispose(){this.disposed||=(this.querySet!=null&&this.querySet.destroy(),this.bufferManager.dispose(),this.textureManager.dispose(),!0)}};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2022 Google Inc. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
ai.nextDataId=0,ti()&&Gt(`webgpu`,async()=>{let e={powerPreference:M().get(`WEBGPU_USE_LOW_POWER_GPU`)?`low-power`:`high-performance`},t=await navigator.gpu.requestAdapter(e),n={},r=[];t.features.has(`timestamp-query`)&&r.push(`timestamp-query`),t.features.has(`bgra8unorm-storage`)&&r.push([`bgra8unorm-storage`]),n.requiredFeatures=r;let i=t.limits;return n.requiredLimits={maxComputeWorkgroupStorageSize:i.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:i.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:i.maxStorageBufferBindingSize,maxBufferSize:i.maxBufferSize,maxComputeWorkgroupSizeX:i.maxComputeWorkgroupSizeX,maxComputeInvocationsPerWorkgroup:i.maxComputeInvocationsPerWorkgroup},new ai(await t.requestDevice(n),`info`in t?t.info:`requestAdapterInfo`in t?await t.requestAdapterInfo():void 0)},3);
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var G;(function(e){e[e.ADD=0]=`ADD`,e[e.ATAN2=1]=`ATAN2`,e[e.COMPLEX_MULTIPLY_IMAG=2]=`COMPLEX_MULTIPLY_IMAG`,e[e.COMPLEX_MULTIPLY_REAL=3]=`COMPLEX_MULTIPLY_REAL`,e[e.DIV=4]=`DIV`,e[e.ELU_DER=5]=`ELU_DER`,e[e.EQUAL=6]=`EQUAL`,e[e.FLOOR_DIV=7]=`FLOOR_DIV`,e[e.GREATER=8]=`GREATER`,e[e.GREATER_EQUAL=9]=`GREATER_EQUAL`,e[e.LESS=10]=`LESS`,e[e.LESS_EQUAL=11]=`LESS_EQUAL`,e[e.LOGICAL_AND=12]=`LOGICAL_AND`,e[e.LOGICAL_OR=13]=`LOGICAL_OR`,e[e.MAX=14]=`MAX`,e[e.MIN=15]=`MIN`,e[e.MOD=16]=`MOD`,e[e.MUL=17]=`MUL`,e[e.NOT_EQUAL=18]=`NOT_EQUAL`,e[e.POW=19]=`POW`,e[e.PRELU=20]=`PRELU`,e[e.SQUARED_DIFFERENCE=21]=`SQUARED_DIFFERENCE`,e[e.SUB=22]=`SUB`})(G||={});function oi(e,t){let n;do{switch(e){case G.ATAN2:n=`let resultTemp = atan2(a, b);`;break;case G.MAX:n=`let resultTemp = max(a, b);`;break;case G.MIN:n=`let resultTemp = min(a, b);`;break;case G.MOD:n=t?`
  let isNaN = !vec4<bool>(b);
  var resultTemp = vec4<f32>(a % b);
  if (!((a[0] < 0. && b[0] < 0.) || (a[0] >= 0. && b[0] > 0.))) {
    resultTemp[0] = (resultTemp[0] + b[0]) % b[0];
  }
  if (!((a[1] < 0. && b[1] < 0.) || (a[1] >= 0. && b[1] > 0.))) {
    resultTemp[1] = (resultTemp[1] + b[1]) % b[1];
  }
  if (!((a[2] < 0. && b[2] < 0.) || (a[2] >= 0. && b[2] > 0.))) {
    resultTemp[2] = (resultTemp[2] + b[2]) % b[2];
  }
  if (!((a[3] < 0. && b[3] < 0.) || (a[3] >= 0. && b[3] > 0.))) {
    resultTemp[3] = (resultTemp[3] + b[3]) % b[3];
  }
`:`
  let isNaN = b == 0.;
  var resultTemp = a % b;
  resultTemp = select((resultTemp + b) % b, resultTemp,
      (a < 0. && b < 0.) || (a >= 0. && b > 0.));
`;break;case G.NOT_EQUAL:n=t?`
  var resultTemp = vec4<f32>(a != b);
  let valueForNaN = 1.0;
`:`
  var resultTemp = f32(a != b);
  let valueForNaN = 1.0;
`;break;case G.POW:n=t?`
  let isModRound1Bool = vec4<i32>(round(abs(b) % vec4<f32>(2.0))) == vec4<i32>(1);
  let isModRound1 = vec4<f32>(isModRound1Bool);
  let multiplier = sign(a) * isModRound1 + (vec4<f32>(1.0) - isModRound1);
  var resultTemp = multiplier * pow(abs(a), b);

  // Ensure that a^0 = 1, including 0^0 = 1 as this correspond to TF and JS
  let isExpZero = b == vec4<f32>(0.0);
  if (isExpZero.r) {
    resultTemp.r = 1.0;
  }
  if (isExpZero.g) {
    resultTemp.g = 1.0;
  }
  if (isExpZero.b) {
    resultTemp.b = 1.0;
  }
  if (isExpZero.a) {
    resultTemp.a = 1.0;
  }
  let isNaN = (a < vec4<f32>(0.0)) & (floor(b) < b);
`:`
  let isNaN = a < 0.0 && floor(b) < b;
  if (b == 0.0) {
    return 1.0;
  }
  var resultTemp = select(sign(a) * pow(abs(a), b), pow(abs(a), b),
      round(abs(b) % 2.0) != 1.0);
`;break;default:continue}let r,i,a;return t?(r=`isnanVec4`,i=`vec4<f32>`,a=`vec4<bool>`):(r=`isnan`,i=`f32`,a=`bool`),`
      let aIsNaN = ${r}(a);
      let aPostLegalization = select(a, ${i}(42), aIsNaN);
      let bIsNaN = ${r}(b);
      let bPostLegalization = select(b, ${i}(42), bIsNaN);
      let isNaN = false;
      let valueForNaN = uniforms.NAN;
      {
        let a = aPostLegalization;
        let b = bPostLegalization;
        ${n}
        return select(
            resultTemp, ${i}(valueForNaN),
            ${a}(isNaN) | aIsNaN | bIsNaN);
      }
    `}while(0);switch(e){case G.ADD:n=`let resultTemp = a + b;`;break;case G.COMPLEX_MULTIPLY_IMAG:n=`let resultTemp = areal * bimag + aimag * breal;`;break;case G.COMPLEX_MULTIPLY_REAL:n=`let resultTemp = areal * breal - aimag * bimag;`;break;case G.DIV:n=`let resultTemp = a / b;`;break;case G.ELU_DER:n=`let resultTemp = select(a * (b + 1.0), a, b >= b - b);`;break;case G.EQUAL:n=`
  let zero = sign(a) * 0 + 0;
  let one = sign(b) * 0 + 1;
  let resultTemp = select(zero, one, a == b);
`;break;case G.FLOOR_DIV:n=`
  let remainder =
      select(a % b, round(a % b), (round(a) == a) & (round(b) == b));
  let quotient = (a - remainder) / b;
  let resultTemp =
      round(select(quotient, quotient - 1, sign(remainder) == -sign(b)));
`;break;case G.GREATER:n=`
  let zero = sign(a) * 0 + 0;
  let one = sign(b) * 0 + 1;
  let resultTemp = select(zero, one, a > b);
`;break;case G.GREATER_EQUAL:n=`
  let zero = sign(a) * 0 + 0;
  let one = sign(b) * 0 + 1;
  let resultTemp = select(zero, one, a >= b);
`;break;case G.LESS:n=`
  let zero = sign(a) * 0 + 0;
  let one = sign(b) * 0 + 1;
  let resultTemp = select(zero, one, a < b);
`;break;case G.LESS_EQUAL:n=`
  let zero = sign(a) * 0 + 0;
  let one = sign(b) * 0 + 1;
  let resultTemp = select(zero, one, a <= b);
`;break;case G.LOGICAL_AND:return t?`return (vec4<f32>(a >= vec4<f32>(1.0)) *
  vec4<f32>(b >= vec4<f32>(1.0)));`:`return f32(a >= 1.0 && b >= 1.0);`;case G.LOGICAL_OR:return t?`return min(vec4<f32>(a >= vec4<f32>(1.0)) +
  vec4<f32>(b >= vec4<f32>(1.0)), vec4<f32>(1.0));`:`return f32(a >= 1.0 || b >= 1.0);`;case G.MUL:n=`let resultTemp = a * b;`;break;case G.PRELU:return t?`
  let aLessThanZero = vec4<f32>(a < vec4<f32>(0.0));
  return (aLessThanZero * (b * a)) + ((vec4<f32>(1.0) - aLessThanZero) * a);
`:`if (a < 0.0) { return b * a; }  return a;`;case G.SQUARED_DIFFERENCE:n=`let resultTemp = (a - b) * (a - b);`;break;case G.SUB:n=`let resultTemp = a - b;`}return`
    ${n}
    return resultTemp;
  `}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var K;(function(e){e[e.ABS=0]=`ABS`,e[e.ACOS=1]=`ACOS`,e[e.ACOSH=2]=`ACOSH`,e[e.ASIN=3]=`ASIN`,e[e.ASINH=4]=`ASINH`,e[e.ATAN=5]=`ATAN`,e[e.ATANH=6]=`ATANH`,e[e.CEIL=7]=`CEIL`,e[e.COS=8]=`COS`,e[e.COSH=9]=`COSH`,e[e.ELU=10]=`ELU`,e[e.ERF=11]=`ERF`,e[e.EXP=12]=`EXP`,e[e.EXPM1=13]=`EXPM1`,e[e.FLOOR=14]=`FLOOR`,e[e.IS_FINITE=15]=`IS_FINITE`,e[e.IS_INF=16]=`IS_INF`,e[e.IS_NAN=17]=`IS_NAN`,e[e.LINEAR=18]=`LINEAR`,e[e.LOG=19]=`LOG`,e[e.LOG1P=20]=`LOG1P`,e[e.LOGICAL_NOT=21]=`LOGICAL_NOT`,e[e.NEG=22]=`NEG`,e[e.RELU=23]=`RELU`,e[e.RELU6=24]=`RELU6`,e[e.LEAKYRELU=25]=`LEAKYRELU`,e[e.RECIPROCAL=26]=`RECIPROCAL`,e[e.ROUND=27]=`ROUND`,e[e.RSQRT=28]=`RSQRT`,e[e.SELU=29]=`SELU`,e[e.SIGMOID=30]=`SIGMOID`,e[e.SIGN=31]=`SIGN`,e[e.SIN=32]=`SIN`,e[e.SINH=33]=`SINH`,e[e.SOFTPLUS=34]=`SOFTPLUS`,e[e.SQRT=35]=`SQRT`,e[e.SQUARE=36]=`SQUARE`,e[e.STEP=37]=`STEP`,e[e.TAN=38]=`TAN`,e[e.TANH=39]=`TANH`,e[e.TO_INT=40]=`TO_INT`})(K||={});const si=`
  // Error function is calculated approximately with elementary function.
  // See "Handbook of Mathematical Functions with Formulas,
  // Graphs, and Mathematical Tables", Abramowitz and Stegun.
  let p = ${xt};
  let a1 = ${Kt};
  let a2 = ${Pn};
  let a3 = ${Sn};
  let a4 = ${en};
  let a5 = ${Xt};

  let sign = sign(a);
  let absA = abs(a);
  let t = 1.0 / (1.0 + p * absA);
  return sign * (1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * exp(-absA * absA));
`,ci=`
  if (a >= 0.0) {
    return ${ar} * a;
  } else {
    return ${_r} * (exp(a) - 1.0);
  }
`;function li(e,t){switch(e){case K.ABS:return`return abs(a);`;case K.ACOS:return`
  if (abs(a) > 1.) {
    return uniforms.NAN;
  }
  return acos(a);
`;case K.ACOSH:return`
  if (a < 1.) {
    return uniforms.NAN;
  }
  return acosh(a);
`;case K.ASIN:return`
  if (abs(a) > 1.) {
    return uniforms.NAN;
  }
  return asin(a);
`;case K.ASINH:return`return asinh(a);`;case K.ATAN:return`
  if (isnan(a)) {
    return uniforms.NAN;
  }
  return atan(a);
`;case K.ATANH:return`
  if (abs(a) > 1.) {
    return uniforms.NAN;
  }
  if (a == 1.) {
    return uniforms.INFINITY;
  }
  if (a == -1.) {
    return -uniforms.INFINITY;
  }
  return atanh(a);
`;case K.COS:return`return cos(a);`;case K.COSH:return`
  let e2x = exp(-a);
  return (e2x + 1.0 / e2x) / 2.0;
`;case K.CEIL:return`return ceil(a);`;case K.ELU:return t?`
  var resFloat = exp(a) - vec4<f32>(1.0);
  if (a.r >= 0.0) {
    resFloat.r = a.r;
  }
  if (a.g >= 0.0) {
    resFloat.g = a.g;
  }
  if (a.b >= 0.0) {
    resFloat.b = a.b;
  }
  if (a.a >= 0.0) {
    resFloat.a = a.a;
  }
  return resFloat;
`:`if (a >= 0.0) { return a; }  return (exp(a) - 1.0);`;case K.ERF:return si;case K.EXP:return`return exp(a);`;case K.EXPM1:return`return exp(a) - 1.0;`;case K.FLOOR:return`return floor(a);`;case K.IS_FINITE:return`return f32(!isnan(a) && !isinf(a));`;case K.IS_INF:return`return f32(isinf(a));`;case K.IS_NAN:return`return f32(isnan(a));`;case K.LINEAR:return`return a;`;case K.LOG:return`if (a < 0.0) { return uniforms.NAN; }
  return log(a);`;case K.LOG1P:return`
  if (isnan(a)) { return a; }
  return log(1.0 + a);
`;case K.LOGICAL_NOT:return`return f32(!(a >= 1.0));`;case K.NEG:return`return -a;`;case K.LEAKYRELU:return t?`
  let aLessThanZero = vec4<f32>(a < vec4<f32>(0.0));
  return (aLessThanZero * (uniforms.alpha * a)) + ((vec4<f32>(1.0) - aLessThanZero) * a);
`:`if (a < 0.0) { return uniforms.alpha * a; } return a;`;case K.RECIPROCAL:return`return 1.0 / a;`;case K.RELU:return t?`
  return select(a, vec4<f32>(0.0), a < vec4<f32>(0.0));
`:`return select(a, 0.0, a < 0.0);`;case K.RELU6:return t?`return clamp(a, vec4<f32>(0.0, 0.0, 0.0, 0.0), vec4<f32>(6.0, 6.0, 6.0, 6.0));`:`return clamp(a, 0.0, 6.0);`;case K.ROUND:return`return round(a);`;case K.RSQRT:return`return inverseSqrt(a);`;case K.SELU:return ci;case K.SIGMOID:return`return 1.0 / (1.0 + exp(-1.0 * a));`;case K.SIGN:return`return sign(a);`;case K.SIN:return`return sin(a);`;case K.SINH:return`
  let e2x = exp(a);
  return (e2x - 1.0 / e2x) / 2.0;
`;case K.SOFTPLUS:return`
  let epsilon = 1.1920928955078125e-7;
  let threshold = log(epsilon) + 2.0;

  let too_large = a > -threshold;
  let too_small = a < threshold;
  let exp_a = exp(a);

  if (too_large) {
    return a;
  } else if (too_small) {
    return exp_a;
  } else {
    return log(exp_a + 1.0);
  }
`;case K.SQRT:return`return sqrt(a);`;case K.SQUARE:return`return a * a;`;case K.STEP:return`
  if (isnan(a)) {
    return a;
  }

  return select(uniforms.stepAlpha, 1.0, a > 0.0);
`;case K.TAN:return`return tan(a);`;case K.TANH:return`
  let e2x = exp(-2.0 * abs(a));
  return sign(a) * (1.0 - e2x) / (1.0 + e2x);
`;case K.TO_INT:return`return f32(i32((a)));`;default:throw Error(`BinaryType ${e} is not implemented!`)}}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function q(e,t=!1,n=!1,r=3){if(e===null)return``;let i=``;if(e===`linear`)i=li(K.LINEAR);else if(e===`relu`)i=li(K.RELU,n);else if(e===`elu`)i=li(K.ELU,n);else if(e===`relu6`)i=li(K.RELU6,n);else if(e===`prelu`)i=oi(G.PRELU,n);else if(e===`sigmoid`)i=li(K.SIGMOID,n);else if(e===`leakyrelu`)i=li(K.LEAKYRELU,n);else throw Error(`Activation ${e} has not been implemented for the WebGPU backend.`);let a=L(n?4:1),o=``;return o=t?`
      fn activation(a : ${a}, coords : vec${r}<i32>) -> ${a} {
        let b = getPreluActivationWeightsByOutputCoords(coords);
        ${i}
      }`:`
      fn activation(a : ${a}, coords : vec${r}<i32>) -> ${a} {
        ${i}
      }`,o}function ui(e,t){return`
      ${e?`value = value + getBiasByOutputCoords(coords);`:``}
      ${t?`value = activation(value, coords);`:``}
      `}
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function di(e,t,n=!1,r=!1,i=!1,a=1){j(e&&a===1||!e,()=>`transposeA ${e} is not compatible with component size ${a}`);let o=`
      ${e?`value = getA(batch, col, row);`:`value = getA(batch, row, col);`}

    `,s=t?`value = getB(batch, col, row);`:`value = getB(batch, row, col);`;return`
  fn mm_readA(batch: i32, row: i32, col: i32) -> ${L(a)} {
    var value = ${L(a)}(0.0);
    ${n&&i?o:`
    ${e?`if(row < uniforms.dimAOuter && col < uniforms.dimInner)`:`if(row < uniforms.aShape[1] && col < uniforms.aShape[2])`}
    {
      ${o}
    }
    `}
    return value;
  }

  fn mm_readB(batch: i32, row: i32, col: i32) -> ${L(a)} {
    var value = ${L(a)}(0.0);
    ${s}
    return value;
  }
  `}function fi(e,t,n,r,i=!1,a=!1,o=!1,s=1){return`
  ${di(n,r,i,a,o,s)}
  fn mm_write(batch: i32, row: i32, col: i32, valueIn: ${L(s)}) {
    ${i&&a?``:`if (row < uniforms.dimAOuter && col < uniforms.dimBOuter)`}
    {
      var value = valueIn;
      let coords = vec3<i32>(batch, row, col);
      ${ui(e,t)}
      setOutputAtCoords(coords[0], coords[1], coords[2], value);
    }
  }
  `}const pi=(e,t)=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batchA,
          kStart + inputRow,
          globalRowStart + inputCol * ${t});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batchA,
          globalRow + innerRow,
          kStart + inputCol * ${t});
        `,mi=(e,t,n,r)=>{if(e)return`
      for (var k = 0; k < ${r}; k++) {
        let BCached0 = mm_Bsub[k][tileCol];
        let ACached0 = mm_Asub[k][localRow];
        for (var i = 0; i < ${n}; i++) {
          acc[i] = fma(BCached0, vec4<f32>(ACached0[i]), acc[i]);
        }
      }`;{let e=``,i=``;for(let n=0;n<t;n++)e+=`let BCached${n} = mm_Bsub[k * ${t} + ${n}][tileCol];`,i+=`acc[i] = fma(BCached${n}, vec4<f32>(ACached[${n}]), acc[i]);`;return`
      for (var k = 0; k < ${r/t}; k++) {
        ${e}
        for (var i = 0; i < ${n}; i++) {
          let ACached = mm_Asub[tileRow + i][k];
          ${i}
        }
      }`}};function hi(e,t,n=!1,r=32,i=!1,a=32,o=!1){let s=t[1]*e[1],c=t[0]*e[0],l=n?s:r,u=n?r:s,d=l/t[0],f=r/t[1],p=e[1],m=e[0];return j((n&&d===4&&e[1]===4||!n&&(d===3||d===4))&&l%t[0]===0&&r%t[1]===0&&e[0]===4,()=>`If transposeA ${n} is true, innerElementSize ${d} and workPerThread[1] ${e[1]} must be 4.
          Otherwise, innerElementSize ${d} must be 3 or 4.
      tileAWidth ${l} must be divisible by workgroupSize[0]${t[0]}. tileInner ${r} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`),`
  var<workgroup> mm_Asub : array<array<vec${d}<f32>, ${l/d}>, ${u}>;
  var<workgroup> mm_Bsub : array<array<vec4<f32>, ${c/e[0]}>, ${r}>;

  ${B()} {
    let localRow = i32(localId.y);
    let tileRow = localRow * ${p};
    let tileCol = i32(localId.x);

    let globalRow = i32(globalId.y) * ${p};
    let globalCol = i32(globalId.x) * ${m};
    let batch = ${i?`0`:`i32(globalId.z)`};
    let batchA = ${i||!o?`batch`:`batch % uniforms.aShape[0]`};
    let batchB = ${i||!o?`batch`:`batch % uniforms.bShape[0]`};
    let globalRowStart = i32(workgroupId.y) * ${s};

    let numTiles = ${i?`${Math.ceil(a/r)}`:`(uniforms.dimInner - 1) / ${r} + 1`};
    var kStart = ${i?`i32(globalId.z) * ${a}`:`0`};

    var acc: array<vec4<f32>, ${p}>;

    // Loop over shared dimension.
    let tileRowB = localRow * ${f};
    for (var t = 0; t < numTiles; t++) {
        // Load one tile of A into local memory.
        for (var innerRow = 0; innerRow < ${p}; innerRow++) {
            let inputRow = tileRow + innerRow;
            let inputCol = tileCol;
            ${pi(n,d)}
        }

        // Load one tile of B into local memory.
        for (var innerRow = 0; innerRow < ${f}; innerRow++) {
            let inputRow = tileRowB + innerRow;
            let inputCol = tileCol;
            mm_Bsub[inputRow][inputCol] = mm_readB(batchB, kStart + inputRow, globalCol);
        }
        kStart = kStart + ${r};
        workgroupBarrier();

        // Compute acc values for a single thread.
        ${mi(n,d,p,r)}
        workgroupBarrier();
    }

    for (var innerRow = 0; innerRow < ${p}; innerRow++) {
        mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
    }
  }`}const gi=e=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batchA,
          kStart + inputRow,
          globalRowStart + inputCol);
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batchA,
          globalRowStart + inputRow,
          kStart + inputCol);
        `,_i=e=>e?`let ACached = mm_Asub[k][tileRow + innerRow];`:`let ACached = mm_Asub[tileRow + innerRow][k];`;function vi(e,t,n=!1,r=32,i=!1,a=32,o=!1,s=!1){let c=e[1]*t[1],l=e[0]*t[0],u=n?c:r,d=n?r:c;j(d%t[1]===0&&u%t[0]===0&&r%t[1]===0,()=>`tileAHight ${d} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${u} must be divisible by workgroupSize[0]${t[0]}, tileInner ${r} must be divisible by workgroupSize[1]${t[1]}`);let f=d/t[1],p=u/t[0],m=r/t[1],h=e[1],g=e[0],_=o?`
      let localRow = i32(localId.y);
      let localCol = i32(localId.x);
      let globalRowStart = i32(workgroupId.y) * ${c};
      let globalColStart = i32(workgroupId.x) * ${l};

      // Loop over shared dimension.
      for (var t = 0; t < numTiles; t++) {
        // Load one tile of A into local memory.
        for (var inputRow = localRow; inputRow < ${d}; inputRow = inputRow + ${t[1]}) {
          for (var inputCol = localCol; inputCol < ${u}; inputCol = inputCol + ${t[0]}) {
            ${gi(n)}
          }
        }
        // Load one tile of B into local memory.
        for (var inputRow = localRow; inputRow < ${r}; inputRow = inputRow + ${t[1]}) {
              for (var inputCol = localCol; inputCol < ${l}; inputCol = inputCol + ${t[0]}) {
            mm_Bsub[inputRow][inputCol] = mm_readB(batchB,
              kStart + inputRow,
              globalColStart + inputCol);
          }
        }
        kStart = kStart + ${r};
        workgroupBarrier();

        // Compute acc values for a single thread.
        var BCached : array<f32, ${g}>;
        for (var k = 0; k < ${r}; k++) {
          for (var inner = 0; inner < ${g}; inner++) {
            BCached[inner] = mm_Bsub[k][localCol + inner * ${t[0]}];
          }
          for (var innerRow = 0; innerRow < ${h}; innerRow++) {
            let ACached = ${n?`mm_Asub[k][localRow + innerRow * ${t[1]}];`:`mm_Asub[localRow + innerRow * ${t[1]}][k];`}
            for (var innerCol = 0; innerCol < ${g}; innerCol++) {
              acc[innerRow][innerCol] =
                  fma(ACached, BCached[innerCol], acc[innerRow][innerCol]);
            }
          }
        }
        workgroupBarrier();
      }
      for (var innerRow = 0; innerRow < ${h}; innerRow++) {
        let gRow = globalRowStart + localRow + innerRow * ${t[1]};
        for (var innerCol = 0; innerCol < ${g}; innerCol++) {
          let gCol = globalColStart + localCol + innerCol * ${t[0]};
          mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
        }
      }
      `:`
  let tileRow = i32(localId.y) * ${h};
  let tileCol = i32(localId.x) * ${g};

  let globalRow = i32(globalId.y) * ${h};
  let globalCol = i32(globalId.x) * ${g};
  let globalRowStart = i32(workgroupId.y) * ${c};

  let tileRowA = i32(localId.y) * ${f};
  let tileColA = i32(localId.x) * ${p};
  let tileRowB = i32(localId.y) * ${m};
  // Loop over shared dimension.
  for (var t = 0; t < numTiles; t++) {
    // Load one tile of A into local memory.
    for (var innerRow = 0; innerRow < ${f}; innerRow++) {
      for (var innerCol = 0; innerCol < ${p}; innerCol++) {
        let inputRow = tileRowA + innerRow;
        let inputCol = tileColA + innerCol;
        ${gi(n)}
      }
    }

    // Load one tile of B into local memory.
    for (var innerRow = 0; innerRow < ${m}; innerRow++) {
      for (var innerCol = 0; innerCol < ${g}; innerCol++) {
        let inputRow = tileRowB + innerRow;
        let inputCol = tileCol + innerCol;
        mm_Bsub[inputRow][inputCol] = mm_readB(batchB,
          kStart + inputRow,
          globalCol + innerCol);
      }
    }
    kStart = kStart + ${r};
    workgroupBarrier();

    // Compute acc values for a single thread.
    var BCached : array<f32, ${g}>;
    for (var k = 0; k < ${r}; k++) {
      for (var inner = 0; inner < ${g}; inner++) {
        BCached[inner] = mm_Bsub[k][tileCol + inner];
      }

      for (var innerRow = 0; innerRow < ${h}; innerRow++) {
        ${_i(n)}
        for (var innerCol = 0; innerCol < ${g}; innerCol++) {
          acc[innerRow][innerCol] =
              fma(ACached, BCached[innerCol], acc[innerRow][innerCol]);
        }
      }
    }

    workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < ${h}; innerRow++) {
    for (var innerCol = 0; innerCol < ${g}; innerCol++) {
      mm_write(batch, globalRow + innerRow, globalCol + innerCol,
          acc[innerRow][innerCol]);
    }
  }
  `;return`
    var<workgroup> mm_Asub : array<array<f32, ${u}>, ${d}>;
    var<workgroup> mm_Bsub : array<array<f32, ${l}>, ${r}>;

    ${B()} {
      let batch = ${i?`0`:`i32(globalId.z)`};
      let batchA = ${i||!s?`batch`:`batch % uniforms.aShape[0]`};
      let batchB = ${i||!s?`batch`:`batch % uniforms.bShape[0]`};
      let numTiles = ${i?`${Math.ceil(a/r)}`:`(uniforms.dimInner - 1) / ${r} + 1`};
      var kStart = ${i?`i32(globalId.z) * ${a}`:`0`};

      var acc : array<array<f32, ${g}>, ${h}>;

      // Without this initialization strange values show up in acc.
      for (var innerRow = 0; innerRow < ${h}; innerRow++) {
        for (var innerCol = 0; innerCol < ${g}; innerCol++) {
          acc[innerRow][innerCol] = 0.0;
        }
      }
      ${_}
    }
  `}const yi=e=>e?`
      mm_readA(batchA, colA, globalRow),
      mm_readA(batchA, colA + 1, globalRow),
      mm_readA(batchA, colA + 2, globalRow),
      mm_readA(batchA, colA + 3, globalRow)
  `:`
      mm_readA(batchA, globalRow, colA),
      mm_readA(batchA, globalRow, colA + 1),
      mm_readA(batchA, globalRow, colA + 2),
      mm_readA(batchA, globalRow, colA + 3)
  `;function bi(e,t=!1){j(e[1]===1&&e[2]===1,()=>`A linear work group size is required. But got ${e}.`);let n=e[0]*4;return`
    var<workgroup> mm_Asub : array<vec4<f32>, ${e[0]}>;

    ${B()} {
      let tileCol = i32(localId.x);
      let globalCol = i32(globalId.x);
      let globalRow = i32(globalId.y);

      let numTiles = (uniforms.dimInner - 1) / ${n} + 1;
      let batch = i32(globalId.z);
      let batchA = batch % uniforms.aShape[0];
      let batchB = batch % uniforms.bShape[0];
      // Without this initialization strange values show up in acc.
      var acc = 0.0;

      // Loop over shared dimension.
      for (var t = 0; t < numTiles; t++) {
        // Load one tile of A into local memory.
        let colA = t * ${n} + tileCol * 4;
        mm_Asub[tileCol] = vec4<f32>(${yi(t)});
        workgroupBarrier();

        // Compute acc values for a single thread.
        for (var k = 0; k < ${n/4}; k++) {
          let rowB = t * ${n} + k * 4;
          let BCached = vec4<f32>(mm_readB(batchB, rowB, globalCol),
                              mm_readB(batchB, rowB + 1, globalCol),
                              mm_readB(batchB, rowB + 2, globalCol),
                              mm_readB(batchB, rowB + 3, globalCol));

          let ACached = mm_Asub[k];
          acc = acc + dot(ACached, BCached);
        }

        workgroupBarrier();
      }

      mm_write(batch, globalRow, globalCol, acc);
    }
  `}var xi=class{constructor(e,t,n=!1,r=!1,i=null,a=null,o=null,s=!1){this.variableNames=[`A`,`B`],this.uniforms=`dimAOuter : i32, dimBOuter : i32, dimInner : i32,`,this.outputShape=t,this.dispatchLayout={x:[2],y:[1],z:[0]};let c=n?e[1]:e[2];if(this.isVec4=(c%4==0&&!n||t[1]%4==0&&n)&&t[2]%4==0&&!r,this.outputComponent=this.isVec4?4:1,this.isVectorA=t[1]===1&&!n,!this.isVec4&&this.isVectorA)this.elementsPerThread=[1,1,1],this.workgroupSize=[32,1,1];else{let e=Zr(t[1],c,t[2],n);this.workgroupSize=e.workgroupSize,this.elementsPerThread=e.elementsPerThread}this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize,this.elementsPerThread);let l=i!=null,u=o!=null;l&&this.variableNames.push(`bias`),u&&this.variableNames.push(`preluActivationWeights`),this.sequentialAccessByThreads=s,this.transposeA=n,this.transposeB=r,this.addBias=l,this.activation=a,this.hasPreluActivationWeights=u,[this.fitAOuter,this.fitBOuter,this.fitInner]=this.getShapeFit(t[1],t[2],c),this.shaderKey=`matMulPacked_${this.elementsPerThread}_${n}_${r}_${this.activation}_${this.fitAOuter}_${this.fitBOuter}_${this.fitInner}_${this.isVec4}_${this.isVectorA}_${this.sequentialAccessByThreads}`}getShapeFit(e,t,n){let r=this.workgroupSize[1]*this.elementsPerThread[1],i=this.workgroupSize[0]*this.elementsPerThread[0];return this.tileInner=!this.isVec4&&this.isVectorA?this.workgroupSize[0]*4:i,[e%r===0,t%i===0,n%this.tileInner===0]}getUserCode(){return`
      ${q(this.activation,this.hasPreluActivationWeights,this.isVec4)}
      ${fi(this.addBias,this.activation,!1,this.transposeB,this.fitAOuter,this.fitBOuter,this.fitInner,this.isVec4?4:1)}
      ${this.isVec4?hi(this.elementsPerThread,this.workgroupSize,this.transposeA,this.tileInner,!1,null,!0):this.isVectorA?bi(this.workgroupSize,this.transposeA):vi(this.elementsPerThread,this.workgroupSize,this.transposeA,this.tileInner,!1,null,this.sequentialAccessByThreads,!0)}
    `}};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Si(e){return`
    var<workgroup> sumValues : array<f32, ${e}>;
    ${B()} {
      let coords = getOutputCoords();
      let batch = coords[0];
      let batchA = batch % uniforms.aShape[0];
      let batchB = batch % uniforms.bShape[0];
      let row = coords[1];
      let col = coords[2];
      var sum = 0.0;
      let Length = uniforms.dimInner;
      for (var k = i32(localId.x); k < Length; k = k + ${e}) {
        let dataA = mm_readA(batchA, row, k);
        let dataB = mm_readB(batchB, k, col);
        sum = sum + dataA * dataB;
      }
      sumValues[localId.x] = sum;
      workgroupBarrier();

      for(var currentSize = ${e/2}u; currentSize > 1u;
          currentSize = currentSize / 2u) {
        if (localId.x < currentSize)
        {
          sumValues[localId.x] = sumValues[localId.x] + sumValues[localId.x + currentSize];
        }
        workgroupBarrier();
      }

      if (localId.x == 0u) {
        sum = sumValues[0] + sumValues[1];
        mm_write(batch, row, col, sum);
      }
    }
  `}var Ci=class{constructor(e,t=!1,n=!1,r=null,i=null,a=null){this.variableNames=[`A`,`B`],this.uniforms=`dimAOuter : i32, dimBOuter : i32, dimInner : i32,`,this.workgroupSize=[256,1,1],this.outputShape=e,this.dispatchLayout={x:[],y:[1,2],z:[0]},this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize);let o=r!=null,s=a!=null;o&&this.variableNames.push(`bias`),s&&this.variableNames.push(`preluActivationWeights`),this.transposeA=t,this.transposeB=n,this.addBias=o,this.activation=i,this.hasPreluActivationWeights=s,this.shaderKey=`matMulReduce_${this.activation}_${t}_${n}`}getUserCode(){return`
      ${q(this.activation,this.hasPreluActivationWeights)}
      ${fi(this.addBias,this.activation,this.transposeA,this.transposeB)}
      ${Si(this.workgroupSize[0])}
    `}};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function wi(e){let t=e[1],n=e[0],r=t>n?t:n;return`
  var<workgroup> mm_Asub : array<array<f32, ${r}>, ${t}>;
  var<workgroup> mm_Bsub : array<array<f32, ${n}>, ${r}>;

  // If the output size is small for matrix multiplication, avoid to use vec4
  // and handle some elements per thread to optimally utilize the ALU.
  // Read data from global memory to registers firstly, then store them into
  // shared memory, so it is instruction-Level parallelism for arithmetic
  // operations and others handle IO operations between barrier api, makes ALU
  // and load/store units work simultaneously, could improves the performance.
  ${B()} {
    let tileRow = i32(localId.y);
    let tileCol = i32(localId.x);
    let globalRow = i32(globalId.y);
    let globalCol = i32(globalId.x);
    let batch = i32(globalId.z);
    let batchA = batch % uniforms.aShape[0];
    let batchB = batch % uniforms.bShape[0];

    // uniforms.dimInner should be greater than 0.
    let numTiles = (uniforms.dimInner - 1) / ${r} + 1;
    var acc = 0.0;

    var globalColA = tileCol;
    var globalRowB = 0;
    var regA = mm_readA(batchA, globalRow, globalColA);
    var regB0 = mm_readB(batchB, globalRowB + 2 * tileRow, globalCol);
    var regB1 = mm_readB(batchB, globalRowB + 2 * tileRow + 1, globalCol);
    globalColA = globalColA + ${r};
    globalRowB = globalRowB + ${r};

    for (var t = 0; t < numTiles; t = t + 1) {
      mm_Asub[tileRow][tileCol] = regA;
      mm_Bsub[2 * tileRow][tileCol] = regB0;
      mm_Bsub[2 * tileRow + 1][tileCol] = regB1;

      workgroupBarrier();

      regA = mm_readA(batchA, globalRow, globalColA);
      regB0 = mm_readB(batchB, globalRowB + 2 * tileRow, globalCol);
      regB1 = mm_readB(batchB, globalRowB + 2 * tileRow + 1, globalCol);
      globalColA = globalColA + ${r};
      globalRowB = globalRowB + ${r};

      for (var k = 0; k < ${r}; k = k + 1) {
        acc = acc + mm_Asub[tileRow][k] * mm_Bsub[k][tileCol];
      }
      workgroupBarrier();
    }

    mm_write(batch, globalRow, globalCol, acc);
  }
  `}var Ti=class{constructor(e,t,n,r=!1,i=!1,a=null,o=null,s=null){this.variableNames=[`A`,`B`],this.uniforms=`dimAOuter : i32, dimBOuter : i32, dimInner : i32,`,this.workgroupSize=[16,8,1],this.outputShape=n,this.dispatchLayout={x:[2],y:[1],z:[0]},this.dispatch=[Math.ceil(n[2]/this.workgroupSize[0]),Math.ceil(n[1]/this.workgroupSize[1]),n[0]];let c=a!=null;c&&this.variableNames.push(`bias`);let l=s!=null;l&&this.variableNames.push(`preluActivationWeights`),this.transposeA=r,this.transposeB=i,this.addBias=c,this.activation=o,this.hasPreluActivationWeights=l,this.shaderKey=`matMulSmallOutputSize_${this.activation}_${r}_${i}`}getUserCode(){return`
      ${q(this.activation,this.hasPreluActivationWeights)}
      ${fi(this.addBias,this.activation,this.transposeA,this.transposeB)}
      ${wi(this.workgroupSize)}
    `}},Ei=class{constructor(e,t,n=!1,r=!1){
/**
* @license
* Copyright 2022 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
this.variableNames=[`A`,`B`],this.uniforms=`dimAOuter : i32, dimBOuter : i32, dimInner : i32,`,this.workgroupSize=[8,8,1],this.atomic=!0,this.splitedDimInner=128,j(e[0]===1,()=>`MatMulSplitKProgram only supports batch = 1.`),this.outputShape=e,this.dispatchLayout={x:[2],y:[1],z:[0,3]};let i=(n&&this.outputShape[1]%4==0||!n&&t%4==0)&&this.outputShape[2]%4==0;this.elementsPerThread=[4,4,this.splitedDimInner],this.outputComponent=i?4:1,i||(this.outputShape[1]<16&&(this.elementsPerThread[1]=1),this.outputShape[2]<16&&(this.elementsPerThread[0]=1)),this.dispatch=H(this.dispatchLayout,[this.outputShape[0],this.outputShape[1],this.outputShape[2],t],this.workgroupSize,this.elementsPerThread),this.transposeA=n,this.transposeB=r,this.shaderKey=`matMulSplitK_${n}_${r}_${this.elementsPerThread}_${this.outputComponent}`}getUserCode(){let e=this.outputComponent;return`
      ${di(!1,this.transposeB,!1,!1,!1,e)}
      fn mm_write(batch: i32, row : i32, col : i32, value : ${L(e)}) {
        if (row < uniforms.dimAOuter && col < uniforms.dimBOuter) {
          let coords = vec3<i32>(batch, row, col);
          let flatIndex = getOutputIndexFromCoords(coords);
          // The problem is that we should initialize output to zero before using.
          // Otherwise, the original value will be added to the result.
          for (var i = 0; i < ${e}; i = i + 1) {
            ${I(`&result[flatIndex + i]`,`${e>1?`value[i]`:`value`}`,`float32`)}
          }
        }
      }
      ${e===4?hi(this.elementsPerThread,this.workgroupSize,this.transposeA,32,!0,this.splitedDimInner):vi(this.elementsPerThread,this.workgroupSize,this.transposeA,32,!0,this.splitedDimInner)}
    `}},Di=class{constructor(e,t=null,n=null,r=null){this.uniforms=``,this.variableNames=[`x`],this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.addBias=t!=null,this.hasPreluActivationWeights=r!=null,this.activation=n,this.addBias&&this.variableNames.push(`bias`),this.hasPreluActivationWeights&&this.variableNames.push(`preluActivationWeights`),this.shaderKey=`biasActivation_${n}`}getUserCode(){return`
    ${q(this.activation,this.hasPreluActivationWeights)}
    ${B(`index`)} {
      if (index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        var value = getXByOutputIndex(index);
        ${ui(this.addBias,this.activation)}
        setOutputAtIndex(index, value);
      }
    }
    `}},Oi=class{constructor(e){
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
this.variableNames=[],this.outputShape=[],this.uniforms=`value : f32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey=`fill`}getUserCode(){return`
    ${B(`index`)} {
      if (index < uniforms.size) {
        setOutputAtIndex(index, uniforms.value);
      }
    }
  `}};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function J(e){let{backend:t,attrs:n}=e,{shape:r,value:i}=n,{dtype:a}=n;if(a||=dt(i),a===`string`){let e=Bn(a,N(r));return e.fill(i),t.makeTensorInfo(r,a,e)}{let e=new Oi(r),n=[{type:`float32`,data:[i]}];return t.runWebGPUProgram(e,[],a,n)}}const ki={kernelName:Dn,backendName:`webgpu`,kernelFunc:J};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Y(e){let{inputs:t,attrs:n}=e,{x:r}=t,{shape:i}=n,a=N(r.shape),o=yt(i,a),s=N(o);return j(a===s,()=>`The new shape (${o}) has ${s} elements and the old shape (${r.shape}) has ${a} elements. The new shape and old shape must have the same number of elements.`),e.backend.incRef(r.dataId),{dataId:r.dataId,shape:o,dtype:r.dtype}}const Ai={kernelName:$n,backendName:`webgpu`,kernelFunc:Y};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ji({a:e,b:t,transposeA:n,transposeB:r,backend:i,bias:a=null,preluActivationWeights:o=null,leakyreluAlpha:s=0,activation:c=null}){let l=e.shape.length,u=t.shape.length,d=n?e.shape[l-2]:e.shape[l-1],f=r?t.shape[u-1]:t.shape[u-2],p=n?e.shape[l-1]:e.shape[l-2],m=r?t.shape[u-2]:t.shape[u-1],h=e.shape.slice(0,-2),g=t.shape.slice(0,-2),_=N(h),v=N(g),y=A(e.shape.slice(0,-2),t.shape.slice(0,-2)).concat([p,m]);j(d===f,()=>`Error in matMul: inner shapes (${d}) and (${f}) of Tensors with shapes ${e.shape} and ${t.shape} and transposeA=${n} and transposeB=${r} must match.`);let b=n?[_,d,p]:[_,p,d],x=r?[v,m,f]:[v,f,m],S=Y({inputs:{x:e},backend:i,attrs:{shape:b}}),C=Y({inputs:{x:t},backend:i,attrs:{shape:x}}),w=[S,C],T=Math.max(_,v),E=[S,C],ee=[{type:`int32`,data:[p]},{type:`int32`,data:[m]},{type:`int32`,data:[d]}],D,O,k=[T,p,m],te=M().get(`WEBGPU_MATMUL_PROGRAM_TYPE`);if(te<0){let e=M().getNumber(`WEBGPU_THRESHOLD_TO_INCREASE_WORKGROUPS_FOR_MATMUL`),t=e>0?e:i.thresholdToIncreaseWorkgroups,n=T*Math.ceil(p/32)*Math.ceil(m/32);te=n<=t||p<=8&&n<=t*2?T*p*m<=128?W.MatMulReduceProgram:T===1&&f>=2e3?W.MatMulSplitKProgram:W.MatMulSmallOutputSizeProgram:W.MatMulPackedProgram}switch(te){case W.MatMulReduceProgram:D=new Ci(k,n,r,a,c,o);break;case W.MatMulSplitKProgram:if(O=J({backend:i,attrs:{shape:k,value:0,dtype:e.dtype}}),D=new Ei(k,f,n,r),a||c){O=i.runWebGPUProgram(D,E,e.dtype,ee,O);let t=new Di(O.shape,a,c,o),n=null,r=[O];a&&r.push(a),o&&r.push(o),c===`leakyrelu`&&(n=[{type:`float32`,data:[s]}],t.uniforms+=` alpha : f32,`);let l=i.runWebGPUProgram(t,r,O.dtype,n);w.push(O);let u=Y({inputs:{x:l},backend:i,attrs:{shape:y}});w.push(l);for(let e of w)i.disposeData(e.dataId);return u}break;case W.MatMulSmallOutputSizeProgram:D=new Ti(b,x,k,n,r,a,c,o);break;case W.MatMulPackedProgram:D=new xi(b,k,n,r,a,c,o,i.adapterInfo.isIntel());break;default:throw Error(`Unsupported MatMulProgramType ${te}.`)}a&&E.push(a),o&&E.push(o),c===`leakyrelu`&&(ee.push({type:`float32`,data:[s]}),D.uniforms+=` alpha : f32,`),O=i.runWebGPUProgram(D,E,e.dtype,ee,O);let ne=Y({inputs:{x:O},backend:i,attrs:{shape:y}});w.push(O);for(let e of w)i.disposeData(e.dataId);return ne}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Mi(e){let{inputs:t,backend:n,attrs:r}=e,{a:i,b:a,bias:o,preluActivationWeights:s}=t,{transposeA:c,transposeB:l,activation:u,leakyreluAlpha:d}=r;return ji({a:i,b:a,transposeA:c,transposeB:l,backend:n,bias:o,preluActivationWeights:s,leakyreluAlpha:d,activation:u})}const Ni={kernelName:u,backendName:`webgpu`,kernelFunc:Mi};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Pi=class{constructor(e,t,n){this.variableNames=[`AReal`,`AImag`,`BReal`,`BImag`],this.workgroupSize=[128,1,1],this.size=!0,this.outputShape=A(t,n),this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey=`binaryOpComplex_${e}`,this.op=e}getUserCode(){return`
      fn binaryOpComplex(
          areal : f32, aimag : f32, breal : f32, bimag : f32) -> f32 {
        ${oi(this.op,!1)}
      }

      ${B(`index`)} {
        if(index < uniforms.size) {
          let areal = getARealByOutputIndex(index);
          let aimag = getAImagByOutputIndex(index);
          let breal = getBRealByOutputIndex(index);
          let bimag = getBImagByOutputIndex(index);
          setOutputAtIndex(index, binaryOpComplex(areal, aimag, breal, bimag));
        }
      }
    `}},Fi=class{constructor(e,t,n){
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
if(this.size=!0,this.variableNames=[`A`,`B`],this.outputShape=A(t,n),this.dispatchLayout=U(this.outputShape),this.op=e,this.useSharedMemoryWithA=t.length<=1&&n.length>1&&t[0]<128,this.useSharedMemoryWithB=n.length<=1&&t.length>1&&n[0]<128,this.useSharedMemoryWithA||this.useSharedMemoryWithB)this.outputComponent=1,this.variableComponents=[1,1],this.lastDimensionSize=this.useSharedMemoryWithB?n[0]:t[0],this.shaderKey=`binary_${e}_${this.lastDimensionSize}`,this.type=`shared`,this.workgroupSize=[256,1,1];else{let r=t.length>0&&t[t.length-1]%4==0,i=n.length>0&&n[n.length-1]%4==0;r&&i?(this.outputComponent=4,this.variableComponents=[4,4]):r&&(Be(n)||n[n.length-1]===1)||i&&(Be(t)||t[t.length-1]===1)?(this.outputComponent=4,this.variableComponents=r?[4,1]:[1,4]):(this.outputComponent=1,this.variableComponents=[1,1]),this.type=`nonshared`,this.shaderKey=`binary_${e}_${this.variableComponents}`,this.workgroupSize=[128,1,1]}this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize,[this.outputComponent,1,1])}getUserCode(){let e,t=this.outputComponent===4?`vec4<f32>`:`f32`,n=`
    fn binaryOperation(a : ${t}, b : ${t}) -> ${t} {
      ${oi(this.op,this.outputComponent===4)}
    };
    `;if(this.type===`shared`){let t=this.lastDimensionSize>1?`coords[${this.outputShape.length-1}]`:`0`,r=this.useSharedMemoryWithB?`let a = getAByOutputIndex(index);
          let b = sharedBuf[${t}];`:`let a = sharedBuf[${t}];
          let b = getBByOutputIndex(index);`;e=`
        ${n}
        var<workgroup> sharedBuf : array<f32, ${this.lastDimensionSize}>;
        ${B(`index`)} {
          // Fill in the shared memory buffer.
          let localIndex = i32(localId.x);
          if(localIndex < ${this.lastDimensionSize}) {
            sharedBuf[localIndex] = f32(${this.useSharedMemoryWithB?`B`:`A`}[localIndex]);
          }
          workgroupBarrier();

          if(index < uniforms.size) {
            let coords = getCoordsFromIndex(index);
            ${r}
            setOutputAtIndex(index, binaryOperation(a, b));
          }
        }
        `}else e=`
       ${n}
       ${B(`index`)} {
         if (index < uniforms.size) {
           let coords = getCoordsFromIndex(index * ${this.outputComponent});
           let a = ${t}(getAByOutputCoords(coords));
           let b = ${t}(getBByOutputCoords(coords));
           setOutputAtIndex(index, binaryOperation(a, b));
         }
       }
       `;return e}};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function X(e){let{inputs:t}=e,{x:n}=t;return e.backend.incRef(n.dataId),{dataId:n.dataId,shape:n.shape,dtype:n.dtype}}const Ii={kernelName:tn,backendName:`webgpu`,kernelFunc:X};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Li(e){let{inputs:t,backend:n}=e,{real:r,imag:i}=t,a=n.makeTensorInfo(r.shape,`complex64`),o=n.tensorMap.get(a.dataId);return o.complexTensorInfos={real:X({inputs:{x:r},backend:n}),imag:X({inputs:{x:i},backend:n})},a}const Ri={kernelName:Ne,backendName:`webgpu`,kernelFunc:Li};
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var zi=class{constructor(e,t,n=``){this.variableNames=[`A`],this.size=!0,this.workgroupSize=[128,1,1],this.outputShape=e,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.op=t,n!==``&&(this.uniforms=n),this.shaderKey=`unary_${t}`}getUserCode(){return`
      fn unaryOperation(a : f32) -> f32 {
        ${li(this.op,!1)}
      }
      ${B(`index`)} {
        if (index < uniforms.size) {
          let a = getAByOutputIndex(index);
          setOutputAtIndex(index, unaryOperation(a));
        }
      }
      `}};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Z({opType:e,cpuKernelImpl:t,dtype:n}){return({inputs:r,backend:i})=>{let{x:a}=r,o=i,s=n||a.dtype;if(o.shouldExecuteOnCPU([a])&&t!=null){let e=t(o.tensorMap.get(a.dataId).values,s);return o.makeTensorInfo(a.shape,s,e)}let c=new zi(a.shape,e);return o.runWebGPUProgram(c,[a],s)}}function Q({opType:e,cpuKernelImpl:t,supportsComplex:n=!1,dtype:r}){return({inputs:i,backend:a})=>{let{a:o,b:s}=i,c=a;if(n&&o.dtype===`complex64`){let t=c.tensorMap.get(o.dataId),n=c.tensorMap.get(s.dataId),r,i;if(e!==G.MUL)[r,i]=[[t.complexTensorInfos.real,n.complexTensorInfos.real],[t.complexTensorInfos.imag,n.complexTensorInfos.imag]].map(t=>{let[n,r]=t,i={dataId:n.dataId,dtype:n.dtype,shape:o.shape},a={dataId:r.dataId,dtype:r.dtype,shape:s.shape},l=new Fi(e,o.shape,s.shape);return c.runWebGPUProgram(l,[i,a],kn(n.dtype,r.dtype))});else{let e=new Pi(G.COMPLEX_MULTIPLY_REAL,o.shape,s.shape),a=new Pi(G.COMPLEX_MULTIPLY_IMAG,o.shape,s.shape),l=[{dataId:t.complexTensorInfos.real.dataId,dtype:t.complexTensorInfos.real.dtype,shape:o.shape},{dataId:t.complexTensorInfos.imag.dataId,dtype:t.complexTensorInfos.imag.dtype,shape:o.shape},{dataId:n.complexTensorInfos.real.dataId,dtype:n.complexTensorInfos.real.dtype,shape:s.shape},{dataId:n.complexTensorInfos.imag.dataId,dtype:n.complexTensorInfos.imag.dtype,shape:s.shape}];r=c.runWebGPUProgram(e,l,`float32`),i=c.runWebGPUProgram(a,l,`float32`)}let a=Li({inputs:{real:r,imag:i},backend:c});return c.disposeData(r.dataId),c.disposeData(i.dataId),a}let l=r||kn(o.dtype,s.dtype);if((o.dtype===`string`||s.dtype===`string`||c.shouldExecuteOnCPU([o,s]))&&t!=null){let e=c.tensorMap.get(o.dataId).values,n=c.tensorMap.get(s.dataId).values,r=o.dtype===`string`?En(e):e,i=o.dtype===`string`?En(n):n,[a,u]=t(o.shape,s.shape,r,i,l);return c.makeTensorInfo(u,l,a)}let u=new Fi(e,o.shape,s.shape);return c.runWebGPUProgram(u,[o,s],l)}}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
const{addImpl:Bi,castImpl:Vi,ceilImpl:Hi,concatImpl:Ui,equalImpl:Wi,expImpl:Gi,expm1Impl:Ki,floorImpl:qi,floorDivImpl:Ji,gatherNdImpl:Yi,gatherV2Impl:Xi,greaterEqualImpl:Zi,greaterImpl:Qi,lessEqualImpl:$i,lessImpl:ea,logImpl:ta,maxImpl:na,maximumImpl:ra,minimumImpl:ia,multiplyImpl:aa,negImpl:oa,notEqualImpl:sa,prodImpl:ca,rangeImpl:la,rsqrtImpl:ua,scatterImpl:da,simpleAbsImpl:fa,sliceImpl:pa,stridedSliceImpl:ma,stringNGramsImpl:ha,subImpl:ga,tileImpl:_a,topKImpl:va,transposeImpl:ya,uniqueImpl:ba}=Zn,xa={kernelName:`Abs`,backendName:`webgpu`,kernelFunc:Z({opType:K.ABS,cpuKernelImpl:fa})},Sa=Z({opType:K.ACOS}),Ca={kernelName:Xn,backendName:`webgpu`,kernelFunc:Sa},wa=Z({opType:K.ACOSH}),Ta={kernelName:Lt,backendName:`webgpu`,kernelFunc:wa},Ea={kernelName:`Add`,backendName:`webgpu`,kernelFunc:Q({opType:G.ADD,cpuKernelImpl:Bi,supportsComplex:!0})}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
;
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Da=class{constructor(e){this.workPerThread=1,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e[0],this.variableNames=e.map((e,t)=>`T${t}`),this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize,[this.workPerThread,1,1]),this.shaderKey=`addN`}getUserCode(){let e=[];this.variableNames.forEach(t=>{e.push(`let v${t} = get${t}ByOutputCoords(coords);`)});let t=this.variableNames.map(e=>`v${e}`).join(` + `);return`
      ${B(`index`)} {
        for (var i = 0; i < ${this.workPerThread}; i = i + 1) {
          let flatIndex = index * ${this.workPerThread} + i;
          if (flatIndex < uniforms.size) {
            let coords = getCoordsFromIndex(flatIndex);
            ${e.join(`
        `)}
            setOutputAtIndex(flatIndex, ${t});
          }
        }
      }
    `}};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Oa(e){let{inputs:t,backend:n}=e,r=t;if(r.length===1)return X({inputs:{x:r[0]},backend:n});let i=r.map(e=>e.dtype).reduce((e,t)=>kn(e,t)),a=new Da(r.map(e=>e.shape));return n.runWebGPUProgram(a,r,i)}const ka={kernelName:xn,backendName:`webgpu`,kernelFunc:Oa};
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Aa=class{constructor(e,t){this.variableNames=[`A`],this.workgroupSize=[16,16,1];let n=Array(e.length);for(let r=0;r<n.length;r++)n[r]=e[t[r]];this.outputShape=n,this.dispatchLayout={x:[0],y:[1]},this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize,[1,1,1]),this.shaderKey=`transposeShared`}getUserCode(){j(this.workgroupSize[0]===this.workgroupSize[1],()=>`Must be a square tile, current tile shape is ${this.workgroupSize[0]} x ${this.workgroupSize[1]}`);let e=this.workgroupSize[0];return`
      var<workgroup> tile : array<array<f32, ${this.workgroupSize[0]+1}>, ${this.workgroupSize[0]}>;
      ${B()} {
        var x = i32(workgroupId.x) * ${e} + i32(localId.x);
        var y = i32(workgroupId.y) * ${e} + i32(localId.y);
        let width = uniforms.outShape[0];
        let height = uniforms.outShape[1];
        if (x < width && y < height) {
          tile[localId.y][localId.x] = f32(A[y * width + x]);
        }
        workgroupBarrier();

        x = i32(workgroupId.y) * ${e} + i32(localId.x);
        y = i32(workgroupId.x) * ${e} + i32(localId.y);
        if (x < height && y < width) {
          setOutputAtIndex((y * height + x), tile[localId.x]
            [localId.y]);
        }
      }
    `}},ja=class{constructor(e,t){
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
this.variableNames=[`A`],this.workPerThread=1,this.workgroupSize=[64,1,1],this.size=!0;let n=Array(e.length);for(let r=0;r<n.length;r++)n[r]=e[t[r]];this.outputShape=n,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize,[this.workPerThread,1,1]),this.newDim=t,this.shaderKey=`transpose_${t}`}getUserCode(){let e=R(this.outputShape.length),t=Ma(this.newDim);return`
      ${B(`index`)} {
        for(var i = 0; i < ${this.workPerThread}; i = i + 1) {
          let flatIndex = index * ${this.workPerThread} + i;
          if(flatIndex < uniforms.size) {
            let coords = getCoordsFromIndex(flatIndex);
            setOutputAtIndex(flatIndex, A[getIndexFromCoords${this.outputShape.length}D(
              ${e}(${t}), uniforms.aShape)]);
          }
        }
      }
    `}};function Ma(e){let t=e.length;if(t>6)throw Error(`Transpose for rank ${t} is not yet supported`);let n=Array(t);for(let t=0;t<e.length;t++)n[e[t]]=`coords.${z(t)}`;return n.join()}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function $(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{perm:a}=r,o=n,s=i.shape.length,c=Array(s);for(let e=0;e<c.length;e++)c[e]=i.shape[a[e]];if(n.shouldExecuteOnCPU([i])){let e=o.tensorMap.get(i.dataId).values,t=ya(e,i.shape,i.dtype,a,c);return n.makeTensorInfo(c,i.dtype,t)}if(i.shape.length===2&&ie(a,[1,0])){let e=new Aa(i.shape,a);return o.runWebGPUProgram(e,[i],i.dtype)}let l=new ja(i.shape,a);return o.runWebGPUProgram(l,[i],i.dtype)}const Na={kernelName:ce,backendName:`webgpu`,kernelFunc:$};
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Pa=class{constructor(e,t,n){this.variableNames=[`x`],this.uniforms=`reduceSize : i32,`,this.size=!0,this.inputShape=[e.batchSize,e.inSize];let[r]=He(this.inputShape,[1]);this.outputShape=r.length===0?[1]:r,this.workgroupSize=e.inSize>=32768&&n>=512?[512,1,1]:e.inSize>=4096?[256,1,1]:[64,1,1],this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,[1,1,1]),this.reduceType=t,this.shaderKey=`reduce_${t}`}getUserCode(){let e=``,t=`0.0`,n=this.workgroupSize[0];this.reduceType===`min`||this.reduceType===`max`?(e=`
         if (isnan(candidate)) {
          bestValue = uniforms.NAN;
         } else if (!isnan(bestValue) && candidate ${this.reduceType===`min`?`<`:`>`} bestValue)
           {  bestValue = candidate; }`,t=`f32(x[offset])`):this.reduceType===`sum`||this.reduceType===`mean`?e=` bestValue = bestValue + candidate; `:this.reduceType===`prod`?(e=` bestValue = bestValue * candidate; `,t=`1.0`):this.reduceType===`all`?(e=` bestValue = f32(bestValue >= 1.0 && candidate >= 1.0); `,t=`1.0`):this.reduceType===`any`&&(e=` bestValue = f32(bestValue >= 1.0 || candidate >= 1.0); `,t=`0.0`);let r=this.reduceType===`mean`?`setOutputAtIndex(outputIndex, bestValue / f32(uniforms.reduceSize));`:`setOutputAtIndex(outputIndex, bestValue);`;return`
       fn DIV_CEIL(a : u32, b : u32) -> u32 {
        return ((a - 1u) / b + 1u);
       }

       ${`
         var<workgroup> xBestValues : array<f32, ${n}>;
       `}
       fn getOffset(outputIndex : i32) -> i32 {
         let outputCoords = getCoordsFromIndex(outputIndex);
         let offset = ${this.outputShape.length===1?`outputCoords`:`outputCoords[0]`} * uniforms.reduceSize;
          return offset;
       }
       ${B(`index`)} {
         let outputIndex = index / ${n};
         let offset = getOffset(outputIndex);
         var bestValue = ${t};
         let Length = uniforms.reduceSize;
         let WorkPerThread = DIV_CEIL(u32(Length), ${n}u);
         for (var k = i32(localId.x); k < Length && outputIndex < uniforms.size;
             k = k + ${n}) {
           let candidate = f32(x[offset + k]);
           ${e}
         }
         xBestValues[localId.x] = bestValue;
         workgroupBarrier();

         var reduceSize = min(u32(Length), ${n}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (localId.x < currentSize) {
            let candidate = xBestValues[localId.x + interval];
            ${e}
            xBestValues[localId.x] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (localId.x == 0u && outputIndex < uniforms.size) {
          ${r}
        }
       }
     `}};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
const Fa={mean:`float32`,all:`bool`,any:`bool`};function Ia(e,t,n,r,i){let a=e.shape.length,o=[],s=P(t,e.shape),l=s,u=c(l,a),d=e;u!=null&&(d=$({inputs:{x:e},attrs:{perm:u},backend:i}),l=nt(l.length,a),o.push(d)),ve(r,l,a);let[f,p]=He(d.shape,l),m=f;n&&(m=xr(f,s));let h;if((r===`max`||r===`prod`)&&i.shouldExecuteOnCPU([d])){let t=i.tensorMap.get(d.dataId).values;switch(r){case`max`:let n=na(t,N(p),m,e.dtype);h=i.makeTensorInfo(m,e.dtype,n);break;case`prod`:let{outVals:a,outShape:o,outDtype:s}=ca(d.shape,d.dtype,t,l);h=i.makeTensorInfo(o,s,a);break;default:throw Error(`${r} CPU implementation is not yet supported.`)}}else{let t=N(p),n={windowSize:t,inSize:t,batchSize:N(d.shape)/t,outSize:1},a=Fa[r]||er(e.dtype),s=[{type:`int32`,data:[t]}],c=new Pa(n,r,i.device.limits.maxComputeWorkgroupSizeX),l=i.runWebGPUProgram(c,[d],a,s);o.push(l),h=Y({inputs:{x:l},attrs:{shape:m},backend:i})}return o.forEach(e=>i.disposeData(e.dataId)),h}
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function La(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{keepDims:a,axis:o}=r;return Ia(i,o,a,`all`,n)}const Ra={kernelName:`All`,backendName:`webgpu`,kernelFunc:La};
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function za(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{keepDims:a,axis:o}=r;return Ia(i,o,a,`any`,n)}const Ba={kernelName:`Any`,backendName:`webgpu`,kernelFunc:za};
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Va=class{constructor(e,t,n){this.workgroupSize=[64,1,1],this.variableNames=[`x`],this.uniforms=`infinityValue : f32,`,this.size=!0;let r=[t];this.op=n===`min`?`<`:`>`;let[i,a]=He(e,r);this.outputShape=i.length===0?[1]:i,this.dispatchLayout=U(this.outputShape),N(a)<32?(this.type=`plain`,this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize)):(this.type=`shared`,this.dispatch=H(this.dispatchLayout,this.outputShape,[1,1,1])),this.inputShape=e,this.shaderKey=`argMinMax_${this.op}_${this.type}`}getUserCode(){let e=this.workgroupSize[0],t=()=>this.inputShape.length===1?`uniforms.xShape`:`uniforms.xShape.${z(this.inputShape.length-1)}`,n=()=>{let e=``;if(this.outputShape.length===1)this.inputShape.length!==1&&(e+=`outputCoords,`);else for(let t=0;t<this.outputShape.length;t++)e+=`outputCoords.${z(t)},`;return e};return this.type===`shared`?`
      fn DIV_CEIL(a : u32, b : u32) -> u32 {
        return ((a - 1u) / b + 1u);
      }

      ${`
      var<workgroup> xBestIndices : array<i32, ${e}>;
      var<workgroup> xBestValues : array<f32, ${e}>;
    `}

      ${B(`index`)} {
        let outputIndex = index / ${e};
        let reduceLength = ${t()};

        var bestIndex = i32(localId.x);
        var bestValue = uniforms.infinityValue;
        let outputCoords = getCoordsFromIndex(outputIndex);
        for (var k = i32(localId.x); k < reduceLength && outputIndex < uniforms.size;
            k = k + ${e}) {
          let candidate = getX(${n()} k);
          if (!isnan(candidate) && candidate ${this.op} bestValue) {
            bestValue = candidate;
            bestIndex = k;
          }
        }
        xBestValues[localId.x] = bestValue;
        xBestIndices[localId.x] = bestIndex;
        workgroupBarrier();

        var reduceSize = min(u32(reduceLength), ${e}u);
        for (var currentSize = reduceSize / 2u; reduceSize > 1u;
            currentSize = reduceSize / 2u) {
          let interval = DIV_CEIL(reduceSize, 2u);
          if (localId.x < currentSize) {
            let candidate = xBestValues[localId.x + interval];
            if (candidate ${this.op} bestValue) {
              bestValue = candidate;
              xBestValues[localId.x] = bestValue;
              xBestIndices[localId.x] = xBestIndices[localId.x + interval];
            }
          }
          reduceSize = interval;
          workgroupBarrier();
        }

        if (localId.x == 0u && outputIndex < uniforms.size) {
          setOutputAtIndexI32(outputIndex, xBestIndices[localId.x]);
        }
      }
    `:`
      ${B(`index`)} {
        if (index < uniforms.size) {
          let outputCoords = getCoordsFromIndex(index);
          var bestIndex = 0;
          var bestValue = getX(${n()} 0);
          let reduceLength = ${t()};
          for (var i = 1; i < reduceLength; i++) {
            let candidate = getX(${n()} i);
            if (candidate ${this.op} bestValue) {
              bestValue = candidate;
              bestIndex = i;
            }
          }
          setOutputAtIndexI32(index, bestIndex);
        }
      }
      `}};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ha(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{axis:a}=r,o=P(a,i.shape),s=c(o,i.shape.length),l=i,u=[];s!=null&&(l=$({inputs:{x:i},backend:n,attrs:{perm:s}}),u.push(l),o=nt(o.length,l.shape.length)),ve(`argMax`,[o[0]],l.shape.length);let d=new Va(l.shape,o[0],`max`),f=n.runWebGPUProgram(d,[l],`int32`,[{type:`float32`,data:[-1/0]}]);return u.forEach(e=>n.disposeData(e.dataId)),f}const Ua={kernelName:ir,backendName:`webgpu`,kernelFunc:Ha};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Wa(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{axis:a}=r,o=P(a,i.shape),s=c(o,i.shape.length),l=i,u=[];s!=null&&(l=$({inputs:{x:i},backend:n,attrs:{perm:s}}),u.push(l),o=nt(o.length,l.shape.length)),ve(`argMin`,[o[0]],l.shape.length);let d=new Va(l.shape,o[0],`min`),f=n.runWebGPUProgram(d,[l],`int32`,[{type:`float32`,data:[1/0]}]);return u.forEach(e=>n.disposeData(e.dataId)),f}const Ga={kernelName:Vt,backendName:`webgpu`,kernelFunc:Wa},Ka=Z({opType:K.ASIN}),qa={kernelName:Yt,backendName:`webgpu`,kernelFunc:Ka},Ja=Z({opType:K.ASINH}),Ya={kernelName:Ln,backendName:`webgpu`,kernelFunc:Ja},Xa=Z({opType:K.ATAN}),Za={kernelName:Tn,backendName:`webgpu`,kernelFunc:Xa},Qa=Q({opType:G.ATAN2}),$a={kernelName:rn,backendName:`webgpu`,kernelFunc:Qa},eo=Z({opType:K.ATANH}),to={kernelName:$t,backendName:`webgpu`,kernelFunc:eo}
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2022 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
;
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var no=class{constructor(e){this.variableNames=[`x`],this.uniforms=`strides : vec2<i32>,`,this.workgroupSize=[256,1,1],this.size=!0,this.outputShape=e.outShape,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey=`poolWithFilterSizeEqualsOne`}getUserCode(){return`
      ${B(`index`)} {
        if (index < uniforms.size) {
          let coords = getCoordsFromIndex(index);
          let batch = coords[0];
          let d = coords[3];

          let xRCCorner = coords.yz * uniforms.strides;
          let xRCorner = xRCCorner.x;
          let xCCorner = xRCCorner.y;

          let value = getX(batch, xRCorner, xCCorner, d);
          setOutputAtIndex(index, value);
        }
      }
    `}},ro=class{constructor(e,t,n=!1,r=!1,i=!1){
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
if(this.variableNames=[`x`],this.uniforms=`strides : vec2<i32>, pads : vec2<i32>, dilations : vec2<i32>, convDims : vec2<i32>, filterDims : vec2<i32>,`,this.workgroupSize=[128,1,1],this.size=!0,t===`avg`&&n)throw Error(`Cannot compute positions for average pool.`);this.outputShape=e.outShape,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.poolType=t,this.computePositions=n,this.flattenPositions=r,this.includeBatchIndex=i,this.shaderKey=`pool2D_${t}_${n}_${r}_${i}`}getUserCode(){let e;e=this.poolType===`avg`?`resultValue = resultValue + value; count = count + 1.0;`:this.computePositions?`let currMaxValue = mix(value, maxValue, maxValueFound);
      if (value >= currMaxValue) {
        maxValue = value;
        maxValueFound = 1.0;
        maxPosition = ${this.flattenPositions?this.includeBatchIndex?`((batch * uniforms.xShape[1] + xR) * uniforms.xShape[2] + xC) * uniforms.xShape[3] + d`:`(xR * uniforms.xShape[2] + xC) * uniforms.xShape[3] + d`:`wR * uniforms.filterDims.y + wC`};
      }`:`resultValue = max(value, resultValue);`;let t=`resultValue`;return this.poolType===`avg`&&(t=`resultValue / max(count, 1.0)`),`
      ${B(`index`)} {
      if (index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
          let batch = coords[0];
          let d = coords[3];
          let xRCCorner = vec2<i32>(coords.yz) * uniforms.strides - uniforms.pads;
          let xRCorner = xRCCorner.x;
          let xCCorner = xRCCorner.y;

          ${this.computePositions?`var maxValue = 0.0;
            var maxValueFound = 0.0;
            var maxPosition = 0;`:`var resultValue = ${this.poolType===`avg`?`0.0`:`-1.0 / pow(10.0, -20.0)`};`}

          var count = 0.0;
          for (var wR = 0; wR < uniforms.filterDims.x; wR = wR + uniforms.dilations.x) {
            let xR = xRCorner + wR;

            if (xR < 0 || xR >= uniforms.convDims.x) {
              continue;
            }

            for (var wC = 0; wC < uniforms.filterDims.y; wC = wC + uniforms.dilations.y) {
              let xC = xCCorner + wC;
              if (xC < 0 || xC >= uniforms.convDims.y) {
                continue;
              }

              let value = getX(batch, xR, xC, d);
              ${e}
            }
          }

          ${this.computePositions?`setOutputAtIndexI32(index, maxPosition);`:`setOutputAtIndex(index, ${t});`}
        }
      }
    `}},io=class{constructor(e,t,n=!1,r=!1,i=!1){if(this.variableNames=[`x`],this.uniforms=`strides : vec3<i32>, pads : vec3<i32>, convDims : vec3<i32>, filterDims : vec3<i32>,`,this.workgroupSize=[128,1,1],this.size=!0,t===`avg`&&n)throw Error(`Cannot compute positions for average pool.`);this.outputShape=e.outShape,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.poolType=t,this.computePositions=n,this.flattenPositions=r,this.includeBatchIndex=i,this.shaderKey=`pool3D_${t}_${n}_${r}_${i}`}getUserCode(){let e;e=this.poolType===`avg`?`resultValue += value; count += 1.0;`:this.computePositions?`let currMaxValue = mix(value, maxValue, maxValueFound);
      if (value >= currMaxValue) {
        maxValue = value;
        maxValueFound = 1.0;
        maxPosition = ${this.flattenPositions?this.includeBatchIndex?`(((batch * uniforms.xShape.y + xD) * uniforms.xShape.z + xR) * uniforms.xShape.w + xC) * uniforms.xShape.u + ch`:`((xD * uniforms.xShape.z + xR) * uniforms.xShape.w + xC) * uniforms.xShape.u + ch`:`wD * uniforms.filterDims.y * uniforms.filterDims.y + wR * uniforms.filterDims.z + wC`};
      }`:`resultValue = max(value, resultValue);`;let t=`resultValue`;return this.poolType===`avg`&&(t=`resultValue / max(count, 1.0)`),`
      ${B(`index`)} {
        if (index < uniforms.size) {
          let coords = getCoordsFromIndex(index);
          let batch = coords.x;
          let ch = coords.u;

          let xCorner = vec3<i32>(coords.y, coords.z, coords.w) * uniforms.strides - uniforms.pads;
          let xDCorner = xCorner.x;
          let xRCorner = xCorner.y;
          let xCCorner = xCorner.z;

          ${this.computePositions?`var maxValue = 0.0;
            var maxValueFound = 0.0;
            var maxPosition = 0;`:`var resultValue = ${this.poolType===`avg`?`0.0`:`-1.0 / pow(10.0, -20.0)`};`}

          var count = 0.0;
          for (var wD = 0; wD < uniforms.filterDims.x; wD++) {
            let xD = xDCorner + wD;
            if (xD < 0 || xD >= uniforms.convDims.x) {
              continue;
            }

            for (var wR = 0; wR < uniforms.filterDims.y; wR++) {
              let xR = xRCorner + wR;
              if (xR < 0 || xR >= uniforms.convDims.y) {
                continue;
              }

              for (var wC = 0; wC < uniforms.filterDims.z; wC++) {
                let xC = xCCorner + wC;
                if (xC < 0 || xC >= uniforms.convDims.z) {
                  continue;
                }

                let value = getX(batch, xD, xR, xC, ch);
                ${e}
              }
            }
          }

          ${this.computePositions?`setOutputAtIndexI32(index, maxPosition);`:`setOutputAtIndex(index, ${t});`}
        }
      }
    `}};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ao(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{reductionIndices:a,keepDims:o}=r;return Ia(i,a,o,`max`,n)}const oo={kernelName:`Max`,backendName:`webgpu`,kernelFunc:ao};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function so(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{keepDims:a,axis:o}=r;return Ia(i,o,a,`mean`,n)}const co={kernelName:T,backendName:`webgpu`,kernelFunc:so};
/**
* @license
* Copyright 2022 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function lo(e,t,n,r){if(t.filterWidth===1&&t.filterHeight===1&&ie(t.inShape,t.outShape))return X({inputs:{x:e},backend:r});if(t.filterWidth===t.inWidth&&t.filterHeight===t.inHeight&&t.batchSize===1&&t.padInfo.type===`VALID`){let i=e.shape.length,a=Y({inputs:{x:e},backend:r,attrs:{shape:[e.shape[i-3]*e.shape[i-2],e.shape[i-1]]}}),o;n===`avg`?o=so({inputs:{x:a},backend:r,attrs:{axis:0,keepDims:!1}}):(j(n===`max`,()=>`Invalid pool type ${n}`),o=ao({inputs:{x:a},backend:r,attrs:{reductionIndices:0,keepDims:!1}}));let s=Y({inputs:{x:o},backend:r,attrs:{shape:t.outShape}});return r.disposeData(a.dataId),r.disposeData(o.dataId),s}let i,a=[{type:`int32`,data:[t.strideHeight,t.strideWidth]}];return t.filterHeight===1&&t.filterWidth===1?i=new no(t):(n===`avg`?i=new ro(t,`avg`):(j(n===`max`,()=>`Invalid pool type ${n}`),i=new ro(t,`max`)),a.push({type:`int32`,data:[t.padInfo.top,t.padInfo.left]},{type:`int32`,data:[t.dilationHeight,t.dilationWidth]},{type:`int32`,data:[t.inHeight,t.inWidth]},{type:`int32`,data:[t.effectiveFilterHeight,t.effectiveFilterWidth]})),r.runWebGPUProgram(i,[e],e.dtype,a)}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function uo(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{filterSize:a,strides:o,pad:s,dimRoundingMode:c}=r;return lo(i,ue(i.shape,a,o,1,s,c),`avg`,n)}const fo={kernelName:wt,backendName:`webgpu`,kernelFunc:uo};
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function po(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{filterSize:a,strides:o,pad:s,dataFormat:c,dimRoundingMode:l}=r,u=pt(i.shape,a,o,[1,1,1],s,l,c),d=new io(u,`avg`),f=[{type:`int32`,data:[u.strideDepth,u.strideHeight,u.strideWidth]},{type:`int32`,data:[u.padInfo.front,u.padInfo.top,u.padInfo.left]},{type:`int32`,data:[u.inDepth,u.inHeight,u.inWidth]},{type:`int32`,data:[u.effectiveFilterDepth,u.effectiveFilterHeight,u.effectiveFilterWidth]}];return n.runWebGPUProgram(d,[i],i.dtype,f)}const mo={kernelName:cr,backendName:`webgpu`,kernelFunc:po};
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var ho=class{constructor(e){this.variableNames=[`dy`],this.uniforms=`strides : vec2<i32>, pads : vec2<i32>, dilations : vec2<i32>, filterDims : vec2<i32>,
       outHeight : i32, outWidth : i32, avgMultiplier : f32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e.inShape,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey=`avgPool2DBackprop`}getUserCode(){return`
      ${B(`index`)} {
      if (index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        let batch = coords[0];
        let d = coords[3];

        let dyRCCorner = vec2<i32>(coords.yz) - uniforms.pads;
        let dyRCorner = dyRCCorner.x;
        let dyCCorner = dyRCCorner.y;

        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).
        // ? = to be determined. : = across all values in that axis.
        var dotProd = 0.0;
        for (var wR = 0; wR < uniforms.filterDims[0]; wR = wR + uniforms.dilations[0]) {
          let dyR = f32(dyRCorner + wR) / f32(uniforms.strides[0]);

          if (dyR < 0.0 || dyR >= f32(uniforms.outHeight) || fract(dyR) > 0.0) {
            continue;
          }
          let idyR = i32(dyR);

          for (var wC = 0; wC < uniforms.filterDims[1]; wC = wC + uniforms.dilations[1]) {
            let dyC = f32(dyCCorner + wC) / f32(uniforms.strides[1]);

            if (dyC < 0.0 || dyC >= f32(uniforms.outWidth) || fract(dyC) > 0.0) {
              continue;
            }
            let idyC = i32(dyC);

            let dyValue = getDy(batch, idyR, idyC, d);

            dotProd = dotProd + dyValue * uniforms.avgMultiplier;
          }
        }
        setOutputAtIndex(index, dotProd);
      }
    }
    `}},go=class{constructor(e){this.variableNames=[`dy`],this.uniforms=`strides : vec3<i32>, pads : vec3<i32>, filterDims : vec3<i32>,
       outDepth : i32, outHeight : i32, outWidth : i32, avgMultiplier : f32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e.inShape,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey=`avgPool3DBackprop`}getUserCode(){return`
      ${B(`index`)} {
      if (index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        let batch = coords.x;
        let ch = coords.u;

        let dyCorner = vec3<i32>(coords.y, coords.z, coords.w) - uniforms.pads;
        let dyDCorner = dyCorner.x;
        let dyRCorner = dyCorner.y;
        let dyCCorner = dyCorner.z;

        // Convolve dy(?, ?, ?, d) with pos mask(:, :, :, ch) to get
        // dx(xD, xR, xC, ch).
        // ? = to be determined. : = across all values in that axis.
        var dotProd = 0.0;
        for (var wD = 0; wD < uniforms.filterDims[0]; wD++) {
          let dyD = f32(dyDCorner + wD) / f32(uniforms.strides[0]);

          if (dyD < 0.0 || dyD >= f32(uniforms.outDepth) || fract(dyD) > 0.0) {
            continue;
          }
          let idyD = i32(dyD);

          for (var wR = 0; wR < uniforms.filterDims[1]; wR++) {
            let dyR = f32(dyRCorner + wR) / f32(uniforms.strides[1]);

            if (dyR < 0.0 || dyR >= f32(uniforms.outHeight) || fract(dyR) > 0.0) {
              continue;
            }
            let idyR = i32(dyR);

            for (var wC = 0; wC < uniforms.filterDims[2]; wC++) {
              let dyC = f32(dyCCorner + wC) / f32(uniforms.strides[2]);

              if (dyC < 0.0 || dyC >= f32(uniforms.outWidth) || fract(dyC) > 0.0) {
                continue;
              }
              let idyC = i32(dyC);

              let dyValue = getDy(batch, idyD, idyR, idyC, ch);
              dotProd += dyValue * uniforms.avgMultiplier;
            }
          }
        }
        setOutputAtIndex(index, dotProd);
      }
    }
    `}};
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function _o(e){let{inputs:t,backend:n,attrs:r}=e,{dy:i,input:a}=t,o=a,{filterSize:s,strides:c,pad:l,dimRoundingMode:u}=r,d=pt(o.shape,s,c,1,l,u),f=new go(d),p=1/(d.filterDepth*d.filterHeight*d.filterWidth),m=[{type:`int32`,data:[d.strideDepth,d.strideHeight,d.strideWidth]},{type:`int32`,data:[d.effectiveFilterDepth-1-d.padInfo.front,d.effectiveFilterHeight-1-d.padInfo.top,d.effectiveFilterWidth-1-d.padInfo.left]},{type:`int32`,data:[d.effectiveFilterDepth,d.effectiveFilterHeight,d.effectiveFilterWidth]},{type:`int32`,data:[d.outDepth]},{type:`int32`,data:[d.outHeight]},{type:`int32`,data:[d.outWidth]},{type:`float32`,data:[p]}];return n.runWebGPUProgram(f,[i],o.dtype,m)}const vo={kernelName:br,backendName:`webgpu`,kernelFunc:_o};
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function yo(e){let{inputs:t,backend:n,attrs:r}=e,{dy:i,input:a}=t,o=a;ni([i,a],`avgPoolGrad`);let{filterSize:s,strides:c,pad:l}=r,u=ue(o.shape,s,c,1,l),d=new ho(u),f=1/(u.filterHeight*u.filterWidth),p=[{type:`int32`,data:[u.strideHeight,u.strideWidth]},{type:`int32`,data:[u.effectiveFilterHeight-1-u.padInfo.top,u.effectiveFilterWidth-1-u.padInfo.left]},{type:`int32`,data:[u.dilationHeight,u.dilationWidth]},{type:`int32`,data:[u.effectiveFilterHeight,u.effectiveFilterWidth]},{type:`int32`,data:[u.outHeight]},{type:`int32`,data:[u.outWidth]},{type:`float32`,data:[f]}];return n.runWebGPUProgram(d,[i],o.dtype,p)}const bo={kernelName:Nt,backendName:`webgpu`,kernelFunc:yo};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function xo(e){let{inputs:t,backend:n,attrs:r}=e,{a:i,b:a}=t,{transposeA:o,transposeB:s}=r;return ji({a:i,b:a,transposeA:o,transposeB:s,backend:n})}const So={kernelName:gr,backendName:`webgpu`,kernelFunc:xo};
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Co=class{constructor(e,t){this.variableNames=[`source`],this.workPerThread=1,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t,this.rank=t.length,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize,[this.workPerThread,1,1]),this.start=e,this.uniforms=`start : ${R(e.length)}, `,this.shaderKey=`slice`}getUserCode(){let e=R(this.rank),t=To(this.rank),n;return n=this.start.length===1?this.outputShape.map((e,t)=>`sourceLoc = uniforms.start + coords;`):this.outputShape.map((e,t)=>`sourceLoc.${wo[t]} = uniforms.start.${z(t)} + coords.${wo[t]};`),`
      ${B(`index`)} {
        if (index < uniforms.size) {
          var sourceLoc : ${e};
          let coords = getCoordsFromIndex(index);
          ${n.join(`
`)}
          setOutputAtIndex(index, getSource(${t}));
        }
      }
    `}};const wo=[`x`,`y`,`z`,`w`,`u`,`v`];function To(e){if(e===1)return`sourceLoc`;if(e<=6)return wo.slice(0,e).map(e=>`sourceLoc.${e}`).join(`,`);throw Error(`Slicing for rank ${e} is not yet supported`)}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Eo(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{begin:o,size:s}=r,[c,l]=i(a,o,s);if(Ae(a,c,l),n.shouldExecuteOnCPU([a])||a.dtype===`string`){let e=n.tensorMap.get(a.dataId),t=pa(e.values,c,l,a.shape,a.dtype);return n.makeTensorInfo(l,a.dtype,t)}if(N(l)===0)return n.makeTensorInfo(l,a.dtype,[]);let u=new Co(c,l),d=[{type:`int32`,data:c}];return n.runWebGPUProgram(u,[a],a.dtype,d)}const Do={kernelName:Ct,backendName:`webgpu`,kernelFunc:Eo},Oo={kernelName:Ye,backendName:`webgpu`,kernelFunc:e=>{
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{blockShape:a,crops:o}=r;j(i.shape.length<=4,()=>`batchToSpaceND for rank > 4 with a WebGPU backend not implemented yet`);let s=a.reduce((e,t)=>e*t),c=pr(i.shape,a,s),l=At(c.length,a.length),u=Ke(i.shape,a,s),d=f(o,a.length),p=lr(u,o,a.length),m=[],h=Y({inputs:{x:i},backend:n,attrs:{shape:c}}),g=$({inputs:{x:h},backend:n,attrs:{perm:l}}),_=Y({inputs:{x:g},backend:n,attrs:{shape:u}}),v=Eo({inputs:{x:_},backend:n,attrs:{begin:d,size:p}});return m.push(h),m.push(g),m.push(_),m.forEach(e=>n.disposeData(e.dataId)),v}},ko=`
  fn bincount_write(index: i32, value: f32) {
    ${I(`&result[index]`,`value`,`float32`)}
  }
`
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
;var Ao=class{constructor(e,t,n=!1){this.outputShape=[],this.variableNames=[`x`],this.uniforms=`binCountSize : i32,`,this.workgroupSize=[64,1,1],this.atomic=!0,this.hasWeights=!0,this.binaryOutput=!1,this.outputShape=e,this.rank=e.length,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.binaryOutput=n,n&&(this.atomic=!1),this.hasWeights=t,this.hasWeights&&this.variableNames.push(`w`),this.shaderKey=`bincount_${this.hasWeights}_${this.binaryOutput}_${this.rank}`}getUserCode(){return`
    ${this.binaryOutput?`
  fn bincount_write(index: i32, value: f32) {
    atomicStore(&result[index], bitcast<i32>(value));
  }
`:ko}
  ${B(`index`)} {
    ${this.rank===1?`if (index < uniforms.xShape) {
      let indexVal = i32(getX(index));
      if (indexVal < uniforms.binCountSize) {
        let value = ${this.binaryOutput?1:this.hasWeights?`getW(index)`:`1.`};
        bincount_write(indexVal, value);
      }
    }`:`let coord = getCoordsFromIndex(index);
    if (coordsInBounds2D(coord, uniforms.xShape)) {
      let indexVal = i32(getX(coord[0], coord[1]));
      if (indexVal < uniforms.binCountSize) {
        let value = ${this.binaryOutput?1:this.hasWeights?`getW(coord[0], coord[1])`:`1.`};
        bincount_write(coord.x * uniforms.binCountSize + indexVal, value);
      }
    }`}
  }
  `}};
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function jo(e){let{inputs:t,backend:n,attrs:r}=e,{x:i,weights:a}=t,{size:o}=r,s=N(i.shape),c=N(a.shape)>0,l=[o],u=a.dtype,d=J({backend:n,attrs:{shape:l,value:0,dtype:u}}),f=new Ao([s],c),p=[{type:`int32`,data:[o]}],m=c?[i,a]:[i];return n.runWebGPUProgram(f,m,u,p,d)}const Mo={kernelName:h,backendName:`webgpu`,kernelFunc:jo};
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var No=class{constructor(e){this.outputShape=[],this.variableNames=[`s0`,`s1`],this.uniforms=`s0Size : i32, s1Size : i32, `,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=[e],this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey=`broadcastArgs`}getUserCode(){return`
  ${B(`index`)} {
    if (index < uniforms.size) {
      var s0 = 1.0;
      var s1 = 1.0;
      let indexS0 = index - uniforms.size + uniforms.s0Size;
      let indexS1 = index - uniforms.size + uniforms.s1Size;
      if (indexS0 >= 0) {
        s0 = getS0(indexS0);
      }
      if (indexS1 >= 0) {
        s1 = getS1(indexS1);
      }

      if (s0 == 1.0) {
        setOutputAtIndex(index, s1);
      } else if (s1 == 1.0) {
        setOutputAtIndex(index, s0);
      } else if (s0 != s1) {
        setOutputAtIndex(index, uniforms.NAN);
      } else {
        setOutputAtIndex(index, s0);
      }
    }
  }
  `}};
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Po(e){let{inputs:t,backend:n}=e,{s0:r,s1:i}=t;if(n.shouldExecuteOnCPU([r,i])){let e=n.tensorMap.get(r.dataId),t=n.tensorMap.get(i.dataId),a=e.values,o=t.values,s=A(Array.from(a),Array.from(o));return n.makeTensorInfo([s.length],`int32`,Int32Array.from(s))}let a=N(r.shape),o=N(i.shape),s=new No(Math.max(a,o)),c=[{type:`int32`,data:[a]},{type:`int32`,data:[o]}];return n.runWebGPUProgram(s,[r,i],`int32`,c)}const Fo={kernelName:fr,backendName:`webgpu`,kernelFunc:Po},Io=Q({opType:G.NOT_EQUAL,dtype:`bool`,cpuKernelImpl:sa}),Lo={kernelName:re,backendName:`webgpu`,kernelFunc:Io}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
;
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ro(e){let{inputs:t,backend:n}=e,{input:r}=t;return X({inputs:{x:n.tensorMap.get(r.dataId).complexTensorInfos.real},backend:n})}const zo={kernelName:ut,backendName:`webgpu`,kernelFunc:Ro};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Bo(e,t){let n=new zi(e.shape,K.TO_INT),r=t.runWebGPUProgram(n,[e],`int32`);return{dataId:r.dataId,shape:r.shape,dtype:r.dtype}}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Vo(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{dtype:a}=r;if(a===`complex64`){if(i.dtype===`complex64`)return X({inputs:{x:i},backend:n});let e=oe(i.shape),t=Vo({inputs:{x:i},backend:n,attrs:{dtype:`float32`}}),r=Li({inputs:{real:t,imag:e},backend:n});return e.dispose(),n.disposeData(t.dataId),r}if(i.dtype===`complex64`){let e=Ro({inputs:{input:i},backend:n}),t=Vo({inputs:{x:e},backend:n,attrs:{dtype:a}});return n.disposeData(e.dataId),t}if(!ht(i.dtype,a)){let e=X({inputs:{x:i},backend:n});return{dataId:e.dataId,shape:e.shape,dtype:a}}if(n.shouldExecuteOnCPU([i])){let e=n.tensorMap.get(i.dataId).values,[t,r,o]=Vi(e,i.shape,i.dtype,a);return n.makeTensorInfo(t,r,o)}if(a===`int32`)return Bo(i,n);if(a===`bool`){let e=n.makeTensorInfo([],`bool`,fe(`bool`,1)),t=Io({inputs:{a:i,b:e},backend:n});return n.disposeData(e.dataId),t}throw Error(`Error in Cast: failed to cast ${i.dtype} to ${a}`)}const Ho={kernelName:$e,backendName:`webgpu`,kernelFunc:Vo},Uo=Z({opType:K.CEIL,cpuKernelImpl:Hi}),Wo={kernelName:C,backendName:`webgpu`,kernelFunc:Uo}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
;
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Go=class{constructor(e){this.variableNames=[`A`],this.uniforms=`minVal : f32, maxVal : f32,`,this.workPerThread=4,this.workgroupSize=[64,1,1],this.outputComponent=4,this.size=!0,this.outputShape=e,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize,[this.workPerThread,1,1]),this.shaderKey=`clipVec4`}getUserCode(){return`
      ${B(`index`)} {
        if(index < uniforms.size) {
          let value = getAByOutputIndex(index);
          var clampedValue = clamp(
              value, vec4<f32>(uniforms.minVal), vec4<f32>(uniforms.maxVal));
          clampedValue = select(clampedValue, value, isnanVec4(value));
          setOutputAtIndex(index, clampedValue);
        }
      }
    `}},Ko=class{constructor(e){
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
this.variableNames=[`A`],this.uniforms=`minVal : f32, maxVal : f32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey=`clip`}getUserCode(){return`
      ${B(`index`)} {
        if(index < uniforms.size) {
          let value = getAByOutputIndex(index);
          if (isnan(value)) {
            setOutputAtIndex(index, value);
            return;
          }
          setOutputAtIndex(index, clamp(value, uniforms.minVal, uniforms.maxVal));
        }
      }
    `}};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function qo(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{clipValueMin:a,clipValueMax:o}=r,s,c=[{type:`float32`,data:[a]},{type:`float32`,data:[o]}];return s=N(i.shape)%4==0?new Go(i.shape):new Ko(i.shape),n.runWebGPUProgram(s,[i],i.dtype,c)}const Jo={kernelName:y,backendName:`webgpu`,kernelFunc:qo};
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Yo=class{constructor(e){this.outputShape=[],this.variableNames=[`real`,`imag`],this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey=`complexAbs`}getUserCode(){return`
    ${B(`index`)} {
      if (index < uniforms.size) {
        let re = abs(getRealByOutputIndex(index));
        let im = abs(getImagByOutputIndex(index));
        let mx = max(re, im);

        // The length function in wgsl may be not underflow-safe on some GPUs.
        // So the safe solution is to ensure underflow-safety in all cases.
        setOutputAtIndex(index, select(mx * length(vec2<f32>(1, min(re, im)/mx)), 0.0, mx == 0.0));
      }
    }
  `}};
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Xo(e,t){return{dataId:t.dataId,dtype:t.dtype,shape:e.shape}}function Zo(e){let{inputs:t,backend:n}=e,{x:r}=t,i=n.tensorMap.get(r.dataId),a=new Yo(r.shape),o=[Xo(r,i.complexTensorInfos.real),Xo(r,i.complexTensorInfos.imag)];return n.runWebGPUProgram(a,o,o[0].dtype)}const Qo={kernelName:_n,backendName:`webgpu`,kernelFunc:Zo};
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var $o=class{constructor(e){this.uniforms=``,this.workPerThread=1,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=g(e,1),this.variableNames=e.map((e,t)=>`T${t}`),this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize,[this.workPerThread,1,1]),this.offsetLength=e.length-1;for(let e=0;e<this.offsetLength;e++)this.uniforms+=`offset${e} : i32,`;this.shaderKey=`concat`}getUserCode(){let e=[];if(this.offsetLength>0){e.push(`if (yC < uniforms.offset0){ setOutputAtCoords(coords.x, coords.y, getT0(yR, yC)); }`);for(let t=1;t<this.offsetLength;t++)e.push(`else if (yC < uniforms.offset${[t]}){ setOutputAtCoords(coords.x, coords.y, getT${t}(yR, yC - uniforms.offset${t-1})); }`);let t=this.offsetLength,n=this.offsetLength-1;e.push(`else { setOutputAtCoords(coords.x, coords.y, getT${t}(yR, yC - uniforms.offset${n})); }`)}else e.push(`setOutputAtCoords(coords.x, coords.y, getT0(yR, yC));`);return`
      ${B(`index`)} {
        for(var i = 0; i < ${this.workPerThread}; i = i + 1) {
          let flatIndex = index * ${this.workPerThread} + i;
          if(flatIndex < uniforms.size) {
            let coords = getCoordsFromIndex(flatIndex);
            let yR = coords.x;
            let yC = coords.y;

            ${e.join(`
        `)}
          }
        }
      }
    `}};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function es(e){let{inputs:t,backend:n}=e,{input:r}=t;return X({inputs:{x:n.tensorMap.get(r.dataId).complexTensorInfos.imag},backend:n})}const ts={kernelName:Zt,backendName:`webgpu`,kernelFunc:es};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ns(e,t,n){let r=e[0].dtype;if(r===`complex64`){let r=e.map(e=>Ro({inputs:{input:e},backend:n})),i=e.map(e=>es({inputs:{input:e},backend:n})),a=ns(r,t,n),o=ns(i,t,n),s=Li({inputs:{real:a,imag:o},backend:n});return r.forEach(e=>n.disposeData(e.dataId)),i.forEach(e=>n.disposeData(e.dataId)),n.disposeData(a.dataId),n.disposeData(o.dataId),s}let i=n.shouldExecuteOnCPU(e);if(r===`string`&&(i=!0),i){let i=e.map(e=>{let r=[-1,N(e.shape.slice(t))];return Y({inputs:{x:e},backend:n,attrs:{shape:r}})}),a=i.map(e=>({vals:n.readSync(e.dataId),shape:e.shape})),o=g(i.map(e=>e.shape),1),s=i[0].shape[0]===1,c=Ui(a,o,r,s),l=g(e.map(e=>e.shape),t),u=n.makeTensorInfo(l,r,c);return i.forEach(e=>n.disposeData(e.dataId)),u}let a=n.device.limits.maxStorageBuffersPerShaderStage-1;if(e.length>a){let r=[];for(let i=0;i<e.length;i+=a){let o=e.slice(i,i+a);r.push(ns(o,t,n))}let i=ns(r,t,n);for(let e of r)n.disposeData(e.dataId);return i}let{tensors2D:o,outShape:s}=rs(e,t,n),c=o.map(e=>e.shape),l=new $o(c),u=[],d=Array(c.length-1);if(d.length>0){d[0]=c[0][1],u.push({type:`int32`,data:[d[0]]});for(let e=1;e<d.length;e++)d[e]=d[e-1]+c[e][1],u.push({type:`int32`,data:[d[e]]})}let f=n.runWebGPUProgram(l,o,o[0].dtype,u);o.forEach(e=>n.disposeData(e.dataId));let p=Y({inputs:{x:f},backend:n,attrs:{shape:s}});return n.disposeData(f.dataId),p}function rs(e,t,n){let r=g(e.map(e=>e.shape),t);return{tensors2D:e.map(e=>Y({inputs:{x:e},backend:n,attrs:{shape:[N(e.shape.slice(0,t)),N(e.shape.slice(t))]}})),outShape:r}}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function is(e){let{inputs:t,backend:n,attrs:r}=e,{axis:i}=r,a=P(i,t[0].shape)[0],o=t.map(e=>e.shape);b(o,a);let s=g(t.map(e=>e.shape),a);if(N(s)===0)return n.makeTensorInfo(s,t[0].dtype,[]);let c=t.filter(e=>N(e.shape)>0);return c.length===1?X({inputs:{x:c[0]},backend:n}):ns(c,a,n)}const as={kernelName:s,backendName:`webgpu`,kernelFunc:is};
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function os(e,t,n,r,i=!1,a=null,o=!1,s=4,c=4,l=4){let u=e=>{switch(e){case 1:return`resData = f32(x[xIndex]);`;case 3:return`resData = vec3<f32>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return`resData = vec4<f32>(x[xIndex / 4]);`;default:throw Error(`innerElementSize ${e} is not supported.`)}},d=e=>{switch(e){case 1:return`return f32(W[row * uniforms.wShape[3] + col]);`;case 4:return`return vec4<f32>(W[(row * uniforms.wShape[3] + col) / 4]);`;default:throw Error(`innerElementSize ${e} is not supported.`)}},f=e?`
      let coord = vec4<i32>(batch, xRow, xCol, xCh);
      `:`
      let coord = vec4<i32>(batch, xCh, xRow, xCol);
      `,p=e?`
      let coords = vec4<i32>(
        batch,
        row / outWidth,
        row % outWidth,
        col);
      `:`
      let coords = vec4<i32>(
        batch,
        row,
        col / outWidth,
        col % outWidth);
      `,m=e?`uniforms.xShape[1]`:`uniforms.xShape[2]`,h=e?`uniforms.xShape[2]`:`uniforms.xShape[3]`,g=e?`row`:`col`,_=e?`col`:`row`,v=`
      let inChannels = uniforms.wShape[2];
      let outWidth = ${e?`uniforms.outShape[2]`:`uniforms.outShape[3]`};
      let outRow = ${g} / outWidth;
      let outCol = ${g} % outWidth;

      let WRow = ${_} / (uniforms.filterDims[1] * inChannels);
      let WCol = ${_} / inChannels % uniforms.filterDims[1];
      let xRow = outRow * uniforms.strides[0] + uniforms.dilations[0] * WRow - uniforms.pads[0];
      let xCol = outCol * uniforms.strides[1] + uniforms.dilations[1] * WCol - uniforms.pads[1];
      let xCh = ${_} % inChannels;
      var resData = ${L(s)}(0.0);
      // The bounds checking is always needed since we use it to pad zero for
      // the 'same' padding type.
      if (xRow >= 0 && xRow < ${m} && xCol >= 0 && xCol < ${h}) {
        ${f}
        let xIndex = getIndexFromCoords4D(coord, uniforms.xShape);
        ${u(s)}
      }
      return resData;`,y=e?t&&r?`
      ${v}`:`
      if (row < uniforms.dimAOuter && col < uniforms.dimInner) {
        ${v}
      }
      return ${L(s)}(0.0);`:r&&n?`
      ${v}`:`
      if (row < uniforms.dimInner && col < uniforms.dimBOuter) {
        ${v}
      }
      return ${L(s)}(0.0);`,b=`${d(c)}`,x=L(l),S=L(e?s:c),C=L(e?c:s);return`
      ${q(a,o,l===4,4)}
      fn mm_readA(batch: i32, row : i32, col : i32) -> ${S} {
        ${e?y:b}
      }

      fn mm_readB(batch: i32, row : i32, col : i32) -> ${C} {
        ${e?b:y}
      }

      fn mm_write(batch: i32, row : i32, col : i32, valueIn : ${x}) {
        if (row < uniforms.dimAOuter && col < uniforms.dimBOuter)
        {
        var value = valueIn;
        let outWidth = ${e?`uniforms.outShape[2]`:`uniforms.outShape[3]`};
        ${p}
        ${ui(i,a)}
        setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
        }
      }`}var ss=class{constructor(e,t,n,r,i=!1,a=null,o=!1,s=!1){this.variableNames=[`x`,`W`],this.uniforms=`filterDims : vec2<i32>, pads : vec2<i32>, strides : vec2<i32>, dilations : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32,`,this.outputShape=e.outShape,this.isChannelsLast=e.dataFormat===`channelsLast`,this.isVec4=((e.inChannels%4==0||e.inChannels%3==0)&&this.isChannelsLast||e.outWidth%4==0&&!this.isChannelsLast)&&e.outChannels%4==0,this.dispatchLayout=this.isChannelsLast?{x:[3],y:[1,2],z:[0]}:{x:[2,3],y:[1],z:[0]},this.workgroupSize=Qr(this.dispatchLayout,this.outputShape,this.isVec4),this.elementsPerThread=$r(this.dispatchLayout,this.outputShape,this.isVec4),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize,this.elementsPerThread),this.isVec4?(this.outputComponent=4,this.isChannelsLast&&e.inChannels%4!=0?(this.innerElementSize=3,this.variableComponents=[1,4]):(this.innerElementSize=4,this.variableComponents=[4,4]),i&&(this.variableNames.push(`bias`),this.variableComponents.push(4)),o&&(this.variableNames.push(`preluActivationWeights`),this.variableComponents.push(4))):(this.innerElementSize=this.elementsPerThread[0],i&&this.variableNames.push(`bias`),o&&this.variableNames.push(`preluActivationWeights`)),this.sequentialAccessByThreads=s,this.addBias=i,this.activation=a,this.hasPreluActivationWeights=o,this.tileAOuter=this.workgroupSize[1]*this.elementsPerThread[1],this.tileBOuter=this.workgroupSize[0]*this.elementsPerThread[0],this.tileInner=Math.max(this.workgroupSize[0]*this.innerElementSize,this.workgroupSize[1]),this.fitAOuter=t%this.tileAOuter===0,this.fitBOuter=n%this.tileBOuter===0,this.fitInner=r%this.tileInner===0,this.shaderKey=`conv2DMM_${this.elementsPerThread}_${this.activation}}_${this.fitAOuter}_${this.fitBOuter}_${this.fitInner}_${this.isVec4}_${this.innerElementSize}_${this.isChannelsLast}_${this.sequentialAccessByThreads}`}getUserCode(){let e=this.isVec4?hi(this.elementsPerThread,this.workgroupSize,!this.isChannelsLast,this.tileInner):vi(this.elementsPerThread,this.workgroupSize,!this.isChannelsLast,this.tileInner,!1,null,this.sequentialAccessByThreads),t=this.isVec4?[this.innerElementSize,4,4]:[1,1,1];return`
    ${os(this.isChannelsLast,this.fitAOuter,this.fitBOuter,this.fitInner,this.addBias,this.activation,this.hasPreluActivationWeights,t[0],t[1],t[2])}
    ${e}
  `}},cs=class{constructor(e,t=!1,n=null,r=!1){
/**
* @license
* Copyright 2022 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
this.variableNames=[`x`,`W`],this.uniforms=`filterDims: vec2<i32>, pads: vec2<i32>, strides: vec2<i32>, dilations: vec2<i32>,`,this.workgroupSize=[4,4,8],this.outputShape=e.outShape,this.isChannelsLast=e.dataFormat===`channelsLast`,this.dispatchLayout=this.isChannelsLast?{x:[2],y:[1],z:[0,3]}:{x:[3],y:[2],z:[0,1]},this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.addBias=t,this.activation=n,this.hasPreluActivationWeights=r,t&&this.variableNames.push(`bias`),r&&this.variableNames.push(`preluActivationWeights`),this.shaderKey=`conv2dnaive_${this.activation}_${this.isChannelsLast}`}getUserCode(){return`
       ${q(this.activation,this.hasPreluActivationWeights,!1,4)}
       fn readInp(batch : i32, row : i32, col : i32, chan : i32) -> f32{
         let coords = vec4<i32>(batch, row, col, chan);
         if (coordsInBounds4D(coords, uniforms.xShape)) {
           return  getX(batch, row, col, chan);
         } else {
          return 0.0;
         }
       }
       fn readFilt(row : i32, col : i32, xChannel : i32, outChannel : i32) -> f32{
         let coords = vec4<i32>(row, col, xChannel, outChannel);
         if(coordsInBounds4D(coords, uniforms.wShape)) {
           return getW(row, col, xChannel, outChannel);
          } else {
            return 0.0;
          }
       }
       fn writeResult(batch : i32, row : i32, col : i32, chan : i32, valueIn : f32) {
         let coords = ${this.isChannelsLast?`vec4<i32>(batch, row, col, chan);`:`vec4<i32>(batch, chan, row, col);`}
         if (coordsInBounds4D(coords, uniforms.outShape)) {
           var value = valueIn;
           ${ui(this.addBias,this.activation)}
           setOutputAtCoords(coords.x, coords.y, coords.z, coords.w, value);
         }
       }
       ${B(`index`)} {
         let coords = getOutputCoords();
         let batch = coords[0];
         let outChannel = ${this.isChannelsLast?`coords[3];`:`coords[1];`}
         let outRow = ${this.isChannelsLast?`coords[1];`:`coords[2];`}
         let outCol = ${this.isChannelsLast?`coords[2];`:`coords[3];`}
         var acc : f32 = 0.0;
         for (var row = 0; row < uniforms.filterDims[0]; row = row + 1) {
           for (var col = 0; col < uniforms.filterDims[1]; col = col + 1) {
             let xRow = outRow * uniforms.strides[0] + uniforms.dilations[0] * row - uniforms.pads[0];
             let xCol = outCol * uniforms.strides[1] + uniforms.dilations[1] * col - uniforms.pads[1];
             for (var xChannel = 0; xChannel < ${this.isChannelsLast?`uniforms.xShape[3];`:`uniforms.xShape[1];`} xChannel = xChannel + 1) {
               ${this.isChannelsLast?`let v = readInp(batch, xRow, xCol, xChannel);`:`let v = readInp(batch, xChannel, xRow, xCol);`}
               let f = readFilt(row, col, xChannel, outChannel);
               acc = acc + v * f;
             }
           }
         }
         writeResult(batch, outRow, outCol, outChannel, acc);
       }
     `}},ls=class{constructor(e,t){
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
this.variableNames=[`x`],this.uniforms=`pads : vec2<i32>, strides : vec2<i32>, dilations : vec2<i32>, outWidth : i32, itemsPerBlockRow : i32,
       inChannels : i32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.isChannelsLast=t,this.shaderKey=`im2col_${this.isChannelsLast}`}getUserCode(){let e=this.isChannelsLast?1:2,t=this.isChannelsLast?2:3,n=this.isChannelsLast?`coords[1]`:`coords[2]`,r=this.isChannelsLast?`coords[2]`:`coords[1]`,i=this.isChannelsLast?`getX(batch, xRow, xCol, ch)`:`getX(batch, ch, xRow, xCol)`;return`
    ${B(`index`)} {
      let coords = getCoordsFromIndex(index);
      if(index < uniforms.size) {
        let batch = coords[0];
        let row = ${n};
        let col = ${r};
        let offsetY = (row / uniforms.outWidth) * uniforms.strides[0] - uniforms.pads[0];
        let xRow = offsetY + uniforms.dilations[0] * (col / uniforms.itemsPerBlockRow);
        var value = 0.0;
        if(xRow < uniforms.xShape[${e}] && xRow >= 0) {
          let offsetX = (row % uniforms.outWidth) * uniforms.strides[1] -
              uniforms.pads[1];
          let xCol = offsetX + uniforms.dilations[1] * ((col %
              uniforms.itemsPerBlockRow) / uniforms.inChannels);
          let ch = col % uniforms.inChannels;
          if(xCol < uniforms.xShape[${t}] && xCol >= 0) {
            value = ${i};
          }
        }
        setOutputAtIndex(index, value);
      }
    }
   `}};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function us(e,t){let n=e.length;return n>=3?t?[...e.slice(0,-3),e[n-3]*e[n-2],e[n-1]]:[...e.slice(0,-3),e[n-3],e[n-2]*e[n-1]]:!t&&n===1&&e[0]>1?[e[0],1]:null}function ds({x:e,filter:t,convInfo:n,backend:r,bias:i=null,preluActivationWeights:a=null,leakyreluAlpha:o=0,activation:s=null}){let c=n.dataFormat===`channelsLast`,l=!c,u=c&&n.filterHeight===n.inHeight&&n.filterWidth===n.inWidth&&n.padInfo.type===`VALID`,d=[],f,p;if(u){let i=n.inHeight*n.inWidth*n.inChannels;f=Y({inputs:{x:e},backend:r,attrs:{shape:[1,n.batchSize,i]}}),p=Y({inputs:{x:t},backend:r,attrs:{shape:[1,i,n.outChannels]}})}else f=Y({inputs:{x:e},backend:r,attrs:{shape:c?[n.batchSize,n.inHeight*n.inWidth,n.inChannels]:[n.batchSize,n.inChannels,n.inHeight*n.inWidth]}}),p=Y({inputs:{x:t},backend:r,attrs:{shape:[1,n.inChannels,n.outChannels]}});if(d.push(f),d.push(p),a!=null){let e=us(a.shape,c);e!=null&&(a=Y({inputs:{x:a},backend:r,attrs:{shape:e}}),d.push(a))}if(i!=null){let e=us(i.shape,c);e!=null&&(i=Y({inputs:{x:i},backend:r,attrs:{shape:e}}),d.push(i))}let m=ji({a:c?f:p,b:c?p:f,transposeA:l,transposeB:!1,backend:r,bias:i,activation:s,preluActivationWeights:a,leakyreluAlpha:o}),h=Y({inputs:{x:m},backend:r,attrs:{shape:n.outShape}});d.push(m);for(let e of d)r.disposeData(e.dataId);return h}function fs({x:e,filter:t,convInfo:n,backend:r,bias:i=null,preluActivationWeights:a=null,leakyreluAlpha:o=0,activation:s=null}){let{filterWidth:c,filterHeight:l,inChannels:u,strideWidth:d,strideHeight:f,padInfo:p,outWidth:m,outHeight:h,dilationWidth:g,dilationHeight:_,dataFormat:v}=n,y=v===`channelsLast`,b=c*l*u,x=h*m,S=new ls(y?[n.batchSize,x,b]:[n.batchSize,b,x],y),C=[{type:`int32`,data:[p.top,p.left]},{type:`int32`,data:[f,d]},{type:`int32`,data:[_,g]},{type:`int32`,data:[m]},{type:`int32`,data:[u*c]},{type:`int32`,data:[u]}],w=r.runWebGPUProgram(S,[e],e.dtype,C),T=[];T.push(w);let E=Y({inputs:{x:t},backend:r,attrs:{shape:[1,b,-1]}});if(T.push(E),a!=null){let e=us(a.shape,y);e!=null&&(a=Y({inputs:{x:a},backend:r,attrs:{shape:e}}),T.push(a))}if(i!=null){let e=us(i.shape,y);e!=null&&(i=Y({inputs:{x:i},backend:r,attrs:{shape:e}}),T.push(i))}let ee=ji({a:y?w:E,b:y?E:w,transposeA:!y,transposeB:!1,backend:r,bias:i,activation:s,preluActivationWeights:a,leakyreluAlpha:o}),D=Y({inputs:{x:ee},backend:r,attrs:{shape:n.outShape}});T.push(ee);for(let e of T)r.disposeData(e.dataId);return D}function ps({x:e,filter:t,convInfo:n,backend:r,bias:i=null,preluActivationWeights:a=null,leakyreluAlpha:o=0,activation:s=null}){let c=i!=null,l=a!=null,u=n.dataFormat===`channelsLast`,d=u&&n.filterHeight===n.inHeight&&n.filterWidth===n.inWidth&&n.padInfo.type===`VALID`,f=M().getBool(`WEBGPU_USE_NAIVE_CONV2D_DEBUG`);if(!f&&(d||n.filterHeight===1&&n.filterWidth===1&&n.dilationHeight===1&&n.dilationWidth===1&&n.strideHeight===1&&n.strideWidth===1&&(n.padInfo.type===`SAME`||n.padInfo.type===`VALID`)))return ds({x:e,filter:t,convInfo:n,backend:r,bias:i,activation:s,preluActivationWeights:a,leakyreluAlpha:o});let p=M().getNumber(`WEBGPU_THRESHOLD_TO_INCREASE_WORKGROUPS_FOR_MATMUL`),m=p>-1?p:r.thresholdToIncreaseWorkgroups,h=n.batchSize*Math.ceil(n.outHeight*n.outWidth/32)*Math.ceil(n.outChannels/32);if(M().getBool(`WEBGPU_CONV_SEPARATE_IM2COL_SHADER`)||h<=m)return fs({x:e,filter:t,convInfo:n,backend:r,bias:i,preluActivationWeights:a,leakyreluAlpha:o,activation:s});let g,_=[n.padInfo.top,n.padInfo.left],v=[{type:`int32`,data:[n.filterHeight,n.filterWidth]},{type:`int32`,data:[..._]},{type:`int32`,data:[n.strideHeight,n.strideWidth]},{type:`int32`,data:[n.dilationHeight,n.dilationWidth]}];if(f)g=new cs(n,c,s,l);else{let e=u?n.outHeight*n.outWidth:n.outChannels,t=u?n.outChannels:n.outHeight*n.outWidth,i=n.filterHeight*n.filterWidth*n.inChannels;v.push({type:`int32`,data:[e]},{type:`int32`,data:[t]},{type:`int32`,data:[i]}),g=new ss(n,e,t,i,c,s,l,r.adapterInfo.isIntel())}let y=[],b=[e,t];c&&(!u&&i.shape.length===1&&(i=Y({inputs:{x:i},backend:r,attrs:{shape:[i.shape[0],1,1]}}),y.push(i)),b.push(i)),l&&(!u&&a.shape.length===1&&(a=Y({inputs:{x:a},backend:r,attrs:{shape:[a.shape[0],1,1]}}),y.push(a)),b.push(a)),s===`leakyrelu`&&(v.push({type:`float32`,data:[o]}),g.uniforms+=` alpha : f32,`);let x=r.runWebGPUProgram(g,b,e.dtype,v);for(let e of y)r.disposeData(e.dataId);return x}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ms(e){let{inputs:t,attrs:n,backend:r}=e,{x:i,filter:a}=t,{strides:o,pad:s,dataFormat:c,dilations:l,dimRoundingMode:u}=n,d=lt(c);return ps({x:i,filter:a,convInfo:D(i.shape,a.shape,o,l,s,u,!1,d),backend:r})}const hs={kernelName:pn,backendName:`webgpu`,kernelFunc:ms};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var gs=class{constructor(e){this.variableNames=[`dy`,`W`],this.uniforms=`filterDims : vec2<i32>, pads : vec2<i32>, strides : vec2<i32>, outBackprop : vec4<i32>,`,this.workgroupSize=[64,1,1],this.size=!1,this.isVec4=!1,this.workPerThread=1,this.outputShape=e.inShape,this.isChannelsLast=e.dataFormat===`channelsLast`,this.isVec4=this.isChannelsLast&&e.outChannels%4==0&&e.inChannels%4==0,this.isVec4?(this.workPerThread=2,this.outputComponent=4,this.workgroupSize=[4,4,4],this.dispatchLayout={x:[3],y:[2],z:[0,1]},this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize,[4,this.workPerThread,1])):(this.size=!0,this.workPerThread=1,this.workgroupSize=[64,1,1],this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize)),this.shaderKey=`conv2DDerInput_${this.isChannelsLast}_${this.isVec4}_${this.workPerThread}`}getUserCode(){let e=this.isChannelsLast?1:2,t=this.isChannelsLast?2:3,n=this.isChannelsLast?3:1,r=`
    ${B()} {
      let batch = i32(globalId.z) / uniforms.outShape[1];
      let r = i32(globalId.z) % uniforms.outShape[1];
      let c = i32(globalId.y) * ${this.workPerThread};
      let d1 = i32(globalId.x) * 4;

      let dyCorner = vec2<i32>(r, c) - uniforms.pads;

      // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
      // ? = to be determined. : = across all values in that axis.
      var dotProd: array<vec4<f32>, ${this.workPerThread}>;
      for (var i = 0; i < ${this.workPerThread}; i++) {
        dotProd[i] = vec4<f32>(0.0);
      }
      for (var wR = 0; wR < uniforms.filterDims.x; wR = wR + 1) {
        let dyR = f32(dyCorner.x + wR) / f32(uniforms.strides.x);
        let wRPerm = uniforms.filterDims.x - 1 - wR;
        if (dyR < 0.0 || dyR >= f32(uniforms.outBackprop[1]) ||
            fract(dyR) > 0.0) {
          continue;
        }
        let idyR = i32(dyR);

        for (var wC = 0; wC < uniforms.filterDims.y; wC = wC + 1) {
          let dyC = f32(dyCorner.y + wC) / f32(uniforms.strides.y);
          let dyC2 = f32(dyCorner.y + 1 + wC) / f32(uniforms.strides.y);
          let wCPerm = uniforms.filterDims.y - 1 - wC;
          var bDyCVal = true;
          var bDyCVal2 = true;
          if (dyC < 0.0 || dyC >= f32(uniforms.outBackprop[2]) ||
              fract(dyC) > 0.0) {
            bDyCVal = false;
          }
          if (dyC2 < 0.0 || dyC2 >= f32(uniforms.outBackprop[2]) ||
              fract(dyC2) > 0.0) {
            bDyCVal2 = false;
          }

          let idyC = i32(dyC);
          let idyC2 = i32(dyC2);
          if (bDyCVal && bDyCVal2) {
            let d2Length = uniforms.outBackprop[3];
            for (var d2 = 0; d2 < d2Length; d2 = d2 + 4) {
              let wValue0 = getW(wRPerm, wCPerm, d1, d2);
              let wValue1 = getW(wRPerm, wCPerm, d1 + 1, d2);
              let wValue2 = getW(wRPerm, wCPerm, d1 + 2, d2);
              let wValue3 = getW(wRPerm, wCPerm, d1 + 3, d2);
              var xValue =  getDy(batch, idyR, idyC, d2);
              let tmpval = vec4<f32>(dot(xValue, wValue0),
                                     dot(xValue, wValue1),
                                     dot(xValue, wValue2),
                                     dot(xValue, wValue3));
              dotProd[0] = dotProd[0] + tmpval;
              xValue = getDy(batch, idyR, idyC2, d2);
              dotProd[1] = dotProd[1] + vec4<f32>(dot(xValue, wValue0),
                                                  dot(xValue, wValue1),
                                                  dot(xValue, wValue2),
                                                  dot(xValue, wValue3));
            }
          } else if (bDyCVal) {
            let d2Length = uniforms.outBackprop[3];
            for (var d2 = 0; d2 < d2Length; d2 = d2 + 4) {
              let wValue0 = getW(wRPerm, wCPerm, d1, d2);
              let wValue1 = getW(wRPerm, wCPerm, d1 + 1, d2);
              let wValue2 = getW(wRPerm, wCPerm, d1 + 2, d2);
              let wValue3 = getW(wRPerm, wCPerm, d1 + 3, d2);
              var xValue =  getDy(batch, idyR, idyC, d2);
              let tmpval = vec4<f32>(dot(xValue, wValue0),
                                     dot(xValue, wValue1),
                                     dot(xValue, wValue2),
                                     dot(xValue, wValue3));
              dotProd[0] = dotProd[0] + tmpval;
            }
          } else if (bDyCVal2) {
            let d2Length = uniforms.outBackprop[3];
            for (var d2 = 0; d2 < d2Length; d2 = d2 + 4) {
              let wValue0 = getW(wRPerm, wCPerm, d1, d2);
              let wValue1 = getW(wRPerm, wCPerm, d1 + 1, d2);
              let wValue2 = getW(wRPerm, wCPerm, d1 + 2, d2);
              let wValue3 = getW(wRPerm, wCPerm, d1 + 3, d2);
              var xValue =  getDy(batch, idyR, idyC2, d2);
              let tmpval = vec4<f32>(dot(xValue, wValue0),
                                     dot(xValue, wValue1),
                                     dot(xValue, wValue2),
                                     dot(xValue, wValue3));
              dotProd[1] = dotProd[1] + tmpval;
            }
          }
        }
      }

      for (var i = 0; i < ${this.workPerThread}; i = i + 1) {
        let coords = vec4<i32>(batch, r, c + i, d1);
        if (coordsInBounds4D(coords, uniforms.outShape)) {
          setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], dotProd[i]);
        }
      }
    }
    `;return this.isVec4?`
    ${r}
    `:`
    ${B(`index`)} {
      if(index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        let batch = coords[0];
        let d1 = coords[${n}];

        let dyCorner = vec2<i32>(coords[${e}], coords[${t}]) - uniforms.pads;
        let dyRCorner = dyCorner.x;
        let dyCCorner = dyCorner.y;

        // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
        // ? = to be determined. : = across all values in that axis.
        var dotProd = 0.0;
        for (var wR = 0; wR < uniforms.filterDims.x; wR = wR + 1) {
          let dyR = (f32(dyRCorner) + f32(wR)) / f32(uniforms.strides.x);
          let wRPerm = uniforms.filterDims.x - 1 - wR;
          if (dyR < 0.0 || dyR >= f32(uniforms.outBackprop[1]) || fract(dyR) > 0.0 ||
              wRPerm < 0) {
            continue;
          }
          let idyR = i32(dyR);

          for (var wC = 0; wC < uniforms.filterDims.y; wC = wC + 1) {
            let dyC = (f32(dyCCorner) + f32(wC)) / f32(uniforms.strides.y);
            let wCPerm = uniforms.filterDims.y - 1 - wC;
            if (dyC < 0.0 || dyC >= f32(uniforms.outBackprop[2]) ||
                fract(dyC) > 0.0 || wCPerm < 0) {
              continue;
            }
            let idyC = i32(dyC);

            for (var d2 = 0; d2 < uniforms.outBackprop[3]; d2 = d2 + 1) {
              let xValue = ${this.isChannelsLast?`getDy(batch, idyR, idyC, d2)`:`getDy(batch, d2, idyR, idyC)`};
              let wValue = getW(wRPerm, wCPerm, d1, d2);
              dotProd = dotProd + xValue * wValue;
            }
          }
        }
        setOutputAtIndex(index, dotProd);
      }
    }
  `}},_s=class{constructor(e){this.variableNames=[`x`,`dy`],this.uniforms=`pads : vec2<i32>, strides : vec2<i32>, batchSize : i32, outHeight : i32, outWidth : i32, inHeight : i32, inWidth : i32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e.filterShape,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.isChannelsLast=e.dataFormat===`channelsLast`,this.shaderKey=`conv2DDerFilter_${this.isChannelsLast}`}getUserCode(){return`
    ${B(`index`)} {
      if(index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        let wR = coords[0];
        let wC = coords[1];
        let d1 = coords[2];
        let d2 = coords[3];

        // Convolve x(?, ?, d1) with dy(:, :, d2) to get dw(wR, wC, d1, d2).
        // ? = to be determined. : = across all values in that axis.
        var dotProd = 0.0;
        for (var b = 0; b < uniforms.batchSize; b = b + 1) {
          for (var yR = 0; yR < uniforms.outHeight; yR = yR + 1) {
            let xR = wR + yR * uniforms.strides[0] - uniforms.pads[0];
            if (xR < 0 || xR >= uniforms.inHeight) {
              continue;
            }

            for (var yC = 0; yC < uniforms.outWidth; yC = yC + 1) {
              let xC = wC + yC * uniforms.strides[1] - uniforms.pads[1];

              if (xC < 0 || xC >= uniforms.inWidth) {
                continue;
              }

              if (${this.isChannelsLast}) {
                let dyValue = getDy(b, yR, yC, d2);
                let xValue = getX(b, xR, xC, d1);
                dotProd = dotProd + xValue * dyValue;
              } else {
                let dyValue = getDy(b, d2, yR, yC);
                let xValue = getX(b, d1, xR, xC);
                dotProd = dotProd + xValue * dyValue;
              }
            }
          }
        }
        setOutputAtIndex(index, dotProd);
      }
    }
  `}},vs=class{constructor(e){this.variableNames=[`x`,`dy`],this.uniforms=`pads : vec3<i32>, strides : vec3<i32>, batchSize : i32, outDepth : i32,
       outHeight : i32, outWidth : i32, inDepth : i32, inHeight : i32, inWidth : i32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e.filterShape,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey=`conv3DDerFilter`}getUserCode(){return`
    ${B(`index`)} {
      if(index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        let wF = coords.x;
        let wR = coords.y;
        let wC = coords.z;
        let d1 = coords.w;
        let d2 = coords.u;

        var dotProd = 0.0;
        for (var b = 0; b < uniforms.batchSize; b++) {
          for (var yF = 0; yF < uniforms.outDepth; yF++) {
            let xF = wF + yF * uniforms.strides[0] - uniforms.pads[0];
            if (xF < 0 || xF >= uniforms.inDepth) {
              continue;
            }

            for (var yR = 0; yR < uniforms.outHeight; yR++) {
              let xR = wR + yR * uniforms.strides[1] - uniforms.pads[1];
              if (xR < 0 || xR >= uniforms.inHeight) {
                continue;
              }

              for (var yC = 0; yC < uniforms.outWidth; yC++) {
                let xC = wC + yC * uniforms.strides[2] - uniforms.pads[2];
                if (xC < 0 || xC >= uniforms.inWidth) {
                  continue;
                }

                let dyValue = getDy(b, yF, yR, yC, d2);
                let xValue = getX(b, xF, xR, xC, d1);
                dotProd += xValue * dyValue;
              }
            }
          }
        }
        setOutputAtIndex(index, dotProd);
      }
    }
  `}},ys=class{constructor(e){this.variableNames=[`dy`,`W`],this.uniforms=`filterDims : vec3<i32>, pads : vec3<i32>, strides : vec3<i32>,
      outDepth : i32, outHeight : i32, outWidth : i32, outChannels : i32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e.inShape,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey=`conv3DDerInput`}getUserCode(){return`
    ${B(`index`)} {
      if(index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        let batch = coords.x;
        let d1 = coords.u;

        let dyCorner = vec3<i32>(coords.y, coords.z, coords.w) - uniforms.pads;
        let dyFCorner = dyCorner.x;
        let dyRCorner = dyCorner.y;
        let dyCCorner = dyCorner.z;

        var dotProd = 0.0;
        for (var wF = 0; wF < uniforms.filterDims[0]; wF++) {
          let dyF = f32(dyFCorner + wF) / f32(uniforms.strides[0]);
          if (dyF < 0.0 || dyF >= f32(uniforms.outDepth) || fract(dyF) > 0.0) {
            continue;
          }
          let idyF = i32(dyF);

          let wFPerm = uniforms.filterDims[0] - 1 - wF;

          for (var wR = 0; wR < uniforms.filterDims[1]; wR++) {
            let dyR = f32(dyRCorner + wR) / f32(uniforms.strides[1]);

            if (dyR < 0.0 || dyR >= f32(uniforms.outHeight) || fract(dyR) > 0.0) {
              continue;
            }
            let idyR = i32(dyR);

            let wRPerm = uniforms.filterDims[1] - 1 - wR;

            for (var wC = 0; wC < uniforms.filterDims[2]; wC++) {
              let dyC = f32(dyCCorner + wC) / f32(uniforms.strides[2]);

              if (dyC < 0.0 || dyC >= f32(uniforms.outWidth) || fract(dyC) > 0.0) {
                continue;
              }
              let idyC = i32(dyC);

              let wCPerm = uniforms.filterDims[2] - 1 - wC;

              for (var d2 = 0; d2 < uniforms.outChannels; d2++) {
                let xValue = getDy(batch, idyF, idyR, idyC, d2);
                let wValue = getW(wFPerm, wRPerm, wCPerm, d1, d2);
                dotProd += xValue * wValue;
              }
            }
          }
        }
        setOutputAtIndex(index, dotProd);
      }
    }
  `}};
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function bs(e){let{inputs:t,backend:n,attrs:r}=e,{x:i,dy:a}=t,{strides:o,pad:s,dataFormat:c,dimRoundingMode:l,filterShape:u}=r,d=lt(c),f=D(i.shape,u,o,1,s,l,!1,d),p=new _s(f),m=[{type:`int32`,data:[f.padInfo.top,f.padInfo.left]},{type:`int32`,data:[f.strideHeight,f.strideWidth]},{type:`int32`,data:[f.batchSize]},{type:`int32`,data:[f.outHeight]},{type:`int32`,data:[f.outWidth]},{type:`int32`,data:[f.inHeight]},{type:`int32`,data:[f.inWidth]}];return n.runWebGPUProgram(p,[i,a],i.dtype,m)}const xs={kernelName:Te,backendName:`webgpu`,kernelFunc:bs};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ss(e=4){let t=e=>{switch(e){case 1:return`return W[getIndexFromCoords4D(coord, uniforms.wShape)];`;case 4:return`
            let coord1 = vec4<i32>(coordX, coordY, col + 1, rowInner);
            let coord2 = vec4<i32>(coordX, coordY, col + 2, rowInner);
            let coord3 = vec4<i32>(coordX, coordY, col + 3, rowInner);
            let v0 = W[getIndexFromCoords4D(coord, uniforms.wShape)];
            let v1 = W[getIndexFromCoords4D(coord1, uniforms.wShape)];
            let v2 = W[getIndexFromCoords4D(coord2, uniforms.wShape)];
            let v3 = W[getIndexFromCoords4D(coord3, uniforms.wShape)];
            return vec4<f32>(v0, v1, v2, v3);
            `;default:throw Error(`innerElementSize ${e} is not supported.`)}},n=`if (row < uniforms.dimAOuter && col < uniforms.dimInner) {
        ${`
      let outRow = row / uniforms.outShape[2];
      let outCol = row % uniforms.outShape[2];

      let WRow = col / (uniforms.filterDims[1] * uniforms.outBackprop[3]);
      let WCol = col / uniforms.outBackprop[3] % uniforms.filterDims[1];
      let xR = f32(outRow - uniforms.pads[0] + WRow) / f32(uniforms.strides[0]);
      let xC = f32(outCol - uniforms.pads[1] + WCol) / f32(uniforms.strides[1]);
      if (xR < 0.0 || xR >= f32(uniforms.outBackprop[1]) || fract(xR) > 0.0) {
        return ${L(e)}(0.0);
      }
      if (xC < 0.0 || xC >= f32(uniforms.outBackprop[2]) || fract(xC) > 0.0) {
        return ${L(e)}(0.0);
      }
      let coord = vec4<i32>(
          batch,
          i32(xR),
          i32(xC),
          col % uniforms.outBackprop[3]);
      return x[getIndexFromCoords4D(coord, uniforms.xShape)/${e}];`}
      }
      return ${L(e)}(0.0);`;return`
  fn mm_readA(batch: i32, row : i32, col : i32) -> ${L(e)} {
    ${n}
  }

  fn mm_readB(batch: i32, row : i32, col : i32) -> ${L(e)} {
    let coordX = uniforms.filterDims.x - 1 -
        row / (uniforms.filterDims[1] * uniforms.outBackprop[3]);
    let coordY = uniforms.filterDims.y - 1 -
        (row / uniforms.outBackprop[3]) % uniforms.filterDims[1];
    if (row < uniforms.dimInner && col < uniforms.dimBOuter &&
        coordX >= 0 && coordY >= 0) {
      let rowInner = row % uniforms.outBackprop[3];
      let coord = vec4<i32>(coordX, coordY, col, rowInner);
      ${t(e)}
    }
    return ${L(e)}(0.0);
  }

  fn mm_write(batch: i32, row : i32, col : i32, valueInput : ${L(e)}) {
    if (row < uniforms.dimAOuter && col < uniforms.dimBOuter) {
      var value = valueInput;
      let outCoord = vec4<i32>(
          batch,
          row / uniforms.outShape[2],
          row % uniforms.outShape[2],
          col);
      result[getIndexFromCoords4D(outCoord, uniforms.outShape)/${e}] = value;
    }
  }`}var Cs=class{constructor(e){this.variableNames=[`x`,`W`],this.uniforms=`filterDims : vec2<i32>, pads : vec2<i32>, strides : vec2<i32>, outBackprop : vec4<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32,`,this.outputShape=e.inShape,j(e.dataFormat===`channelsLast`,()=>`TODO: NCHW is unimplemented`),this.isVec4=e.inChannels%4==0&&e.outChannels%4==0,this.dispatchLayout={x:[3],y:[1,2],z:[0]},this.workgroupSize=Qr(this.dispatchLayout,this.outputShape,this.isVec4),this.elementsPerThread=$r(this.dispatchLayout,this.outputShape,this.isVec4),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize,this.elementsPerThread),this.isVec4&&(this.outputComponent=4,this.variableComponents=[4,1]),this.shaderKey=`conv2DDerInputMM_${this.isVec4}_${this.elementsPerThread}`}getUserCode(){let e=this.isVec4?hi(this.elementsPerThread,this.workgroupSize):vi(this.elementsPerThread,this.workgroupSize);return`
    ${Ss(this.isVec4?4:1)}
    ${e}
    `}};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ws(e){let{inputs:t,backend:n,attrs:r}=e,{dy:i,filter:a}=t,{inputShape:o,strides:s,pad:c,dataFormat:l,dimRoundingMode:u}=r,d=lt(l),f=D(o,a.shape,s,1,c,u,!1,d),p=[{type:`int32`,data:[f.filterHeight,f.filterWidth]},{type:`int32`,data:[f.filterHeight-1-f.padInfo.top,f.filterWidth-1-f.padInfo.left]},{type:`int32`,data:[f.strideHeight,f.strideWidth]},{type:`int32`,data:[f.batchSize,f.outHeight,f.outWidth,f.outChannels]}],m;if(M().getBool(`WEBGPU_USE_NAIVE_CONV2D_TRANSPOSE`)||f.dataFormat!==`channelsLast`)m=new gs(f);else{m=new Cs(f);let e=f.inHeight*f.inWidth,t=f.inChannels,n=f.filterHeight*f.filterWidth*f.outChannels;p.push({type:`uint32`,data:[e]},{type:`uint32`,data:[t]},{type:`uint32`,data:[n]})}return n.runWebGPUProgram(m,[i,a],`float32`,p)}const Ts={kernelName:ke,backendName:`webgpu`,kernelFunc:ws};
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Es=class{constructor(e){this.variableNames=[`x`,`W`],this.uniforms=`filterDims: vec3<i32>, pads: vec3<i32>, strides: vec3<i32>, dilations: vec3<i32>,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e.outShape,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey=`conv3dnaive`}getUserCode(){return`
    ${B(`index`)} {
      if (index < uniforms.size) {
        let coords = getOutputCoords();
        let batch = coords.x;
        let d2 = coords.u;

        let xFRCCorner = vec3<i32>(coords.y, coords.z, coords.w) * uniforms.strides - uniforms.pads;
        let xFCorner = xFRCCorner.x;
        let xRCorner = xFRCCorner.y;
        let xCCorner = xFRCCorner.z;

        let inputDepthNearestVec4 = (uniforms.xShape.u / 4) * 4;
        let inputDepthVec4Remainder = uniforms.xShape.u % 4;

        var dotProd = 0.0;
        for (var wF = 0; wF < uniforms.filterDims[0]; wF++) {
          let xF = xFCorner + wF * uniforms.dilations[0];
          if (xF < 0 || xF >= uniforms.xShape.y) {
            continue;
          }

          for (var wR = 0; wR < uniforms.filterDims[1]; wR++) {
            let xR = xRCorner + wR * uniforms.dilations[1];
            if (xR < 0 || xR >= uniforms.xShape.z) {
              continue;
            }

            for (var wC = 0; wC < uniforms.filterDims[2]; wC++) {
              let xC = xCCorner + wC * uniforms.dilations[2];
              if (xC < 0 || xC >= uniforms.xShape.w) {
                continue;
              }

              for (var d1 = 0; d1 < inputDepthNearestVec4; d1 += 4) {
                let xValues = vec4<f32>(
                  getX(batch, xF, xR, xC, d1),
                  getX(batch, xF, xR, xC, d1 + 1),
                  getX(batch, xF, xR, xC, d1 + 2),
                  getX(batch, xF, xR, xC, d1 + 3)
                );
                let wValues = vec4<f32>(
                  getW(wF, wR, wC, d1, d2),
                  getW(wF, wR, wC, d1 + 1, d2),
                  getW(wF, wR, wC, d1 + 2, d2),
                  getW(wF, wR, wC, d1 + 3, d2)
                );

                dotProd += dot(xValues, wValues);
              }

              if (inputDepthVec4Remainder == 1) {
                dotProd += getX(batch, xF, xR, xC, inputDepthNearestVec4) *
                  getW(wF, wR, wC, inputDepthNearestVec4, d2);
              } else if (inputDepthVec4Remainder == 2) {
                let xValues = vec2<f32>(
                  getX(batch, xF, xR, xC, inputDepthNearestVec4),
                  getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1)
                );
                let wValues = vec2<f32>(
                  getW(wF, wR, wC, inputDepthNearestVec4, d2),
                  getW(wF, wR, wC, inputDepthNearestVec4 + 1, d2)
                );
                dotProd += dot(xValues, wValues);
              } else if (inputDepthVec4Remainder == 3) {
                let xValues = vec3<f32>(
                  getX(batch, xF, xR, xC, inputDepthNearestVec4),
                  getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                  getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2)
                );
                let wValues = vec3<f32>(
                  getW(wF, wR, wC, inputDepthNearestVec4, d2),
                  getW(wF, wR, wC, inputDepthNearestVec4 + 1, d2),
                  getW(wF, wR, wC, inputDepthNearestVec4 + 2, d2)
                );
                dotProd += dot(xValues, wValues);
              }
            }
          }
        }
        setOutputAtIndex(index, dotProd);
      }
    }`}};
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ds(e){let{inputs:t,backend:n,attrs:r}=e,{x:i,filter:a}=t,{strides:o,pad:s,dilations:c}=r,l=me(i.shape,a.shape,o,c,s),u=[l.padInfo.front,l.padInfo.top,l.padInfo.left],d=[{type:`int32`,data:[l.filterDepth,l.filterHeight,l.filterWidth]},{type:`int32`,data:[...u]},{type:`int32`,data:[l.strideDepth,l.strideHeight,l.strideWidth]},{type:`int32`,data:[l.dilationDepth,l.dilationHeight,l.dilationWidth]}],f=new Es(l),p=kn(i.dtype,a.dtype);return n.runWebGPUProgram(f,[i,a],p,d)}const Os={kernelName:Le,backendName:`webgpu`,kernelFunc:Ds};
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ks(e){let{inputs:t,backend:n,attrs:r}=e,{x:i,dy:a}=t,{strides:o,pad:s,filterShape:c}=r,l=me(i.shape,c,o,1,s),u=new vs(l),d=[{type:`int32`,data:[l.padInfo.front,l.padInfo.top,l.padInfo.left]},{type:`int32`,data:[l.strideDepth,l.strideHeight,l.strideWidth]},{type:`int32`,data:[l.batchSize]},{type:`int32`,data:[l.outDepth]},{type:`int32`,data:[l.outHeight]},{type:`int32`,data:[l.outWidth]},{type:`int32`,data:[l.inDepth]},{type:`int32`,data:[l.inHeight]},{type:`int32`,data:[l.inWidth]}];return n.runWebGPUProgram(u,[i,a],a.dtype,d)}const As={kernelName:ee,backendName:`webgpu`,kernelFunc:ks};
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function js(e){let{inputs:t,backend:n,attrs:r}=e,{dy:i,filter:a}=t,{strides:o,pad:s,inputShape:c}=r,l=me(c,a.shape,o,1,s),u=new ys(l),d=[{type:`int32`,data:[l.filterDepth,l.filterHeight,l.filterWidth]},{type:`int32`,data:[l.filterDepth-1-l.padInfo.front,l.filterHeight-1-l.padInfo.top,l.filterWidth-1-l.padInfo.left]},{type:`int32`,data:[l.strideDepth,l.strideHeight,l.strideWidth]},{type:`int32`,data:[l.outDepth]},{type:`int32`,data:[l.outHeight]},{type:`int32`,data:[l.outWidth]},{type:`int32`,data:[l.outChannels]}];return n.runWebGPUProgram(u,[i,a],i.dtype,d)}const Ms={kernelName:le,backendName:`webgpu`,kernelFunc:js},Ns={kernelName:`Cos`,backendName:`webgpu`,kernelFunc:Z({opType:K.COS})},Ps=Z({opType:K.COSH}),Fs={kernelName:xe,backendName:`webgpu`,kernelFunc:Ps}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
;
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Is=class{constructor(e,t,n,r){this.variableNames=[`Image`,`Boxes`,`BoxInd`],this.uniforms=`extrapolationValue : f32,`,this.workgroupSize=[64,1,1],this.size=!0;let[i]=t;this.outputShape=[i,n[0],n[1],e],this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.methodId=+(r===`bilinear`),this.cropHeightBiggerThan1=this.outputShape[1]>1,this.cropWidthBiggerThan1=this.outputShape[2]>1,this.shaderKey=`cropAndResize_${this.methodId}_${this.cropHeightBiggerThan1}_${this.cropWidthBiggerThan1}`}getUserCode(){let[e,t]=[`f32(uniforms.imageShape[1] - 1)`,`f32(uniforms.imageShape[2] - 1)`],[n,r,i]=this.cropHeightBiggerThan1?[`(${e} / f32(uniforms.outShape[1] - 1))`,`(y2-y1) * height_ratio`,`y1*${e} + f32(y)*(height_scale)`]:[`0.0`,`0.0`,`0.5 * (y1+y2) * ${e}`],[a,o,s]=this.cropWidthBiggerThan1?[`(${t} / f32(uniforms.outShape[2] - 1))`,`(x2-x1) * width_ratio`,`x1*${t} + f32(x)*(width_scale)`]:[`0.0`,`0.0`,`0.5 * (x1+x2) * ${t}`];return`
    ${B(`index`)} {
      if (index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        let height_ratio = f32(${n});
        let width_ratio = f32(${a});
        let b = coords[0];
        let y = coords[1];
        let x = coords[2];
        let d = coords[3];
        // get box vals
        let y1 = getBoxes(b, 0);
        let x1 = getBoxes(b, 1);
        let y2 = getBoxes(b, 2);
        let x2 = getBoxes(b, 3);
        // get image in batch index
        let bInd = i32(round(getBoxInd(b)));
        if(bInd < 0 || bInd >= uniforms.outShape[0]) {
          return;
        }
        let height_scale = ${r};
        let width_scale = ${o};
        let in_y = ${i};
        if( in_y < 0.0 || in_y > ${e} ) {
          setOutputAtIndex(index, uniforms.extrapolationValue);
          return;
        }
        let in_x = ${s};
        if( in_x < 0.0 || in_x > ${t} ) {
          setOutputAtIndex(index, uniforms.extrapolationValue);
          return;
        }
        let sourceFracIndexCR = vec2<f32>(in_x,in_y);
        if(${this.methodId} == 1) {
          // Compute the four integer indices.
          let sourceFloorCR = vec2<i32>(sourceFracIndexCR);
          let sourceCeilCR = vec2<i32>(ceil(sourceFracIndexCR));
          let topLeft = getImage(bInd, sourceFloorCR.y, sourceFloorCR.x, d);
          let bottomLeft = getImage(bInd, sourceCeilCR.y, sourceFloorCR.x, d);
          let topRight = getImage(bInd, sourceFloorCR.y, sourceCeilCR.x, d);
          let bottomRight = getImage(bInd, sourceCeilCR.y, sourceCeilCR.x, d);
          let fracCR = sourceFracIndexCR - vec2<f32>(sourceFloorCR);
          let top = topLeft + (topRight - topLeft) * fracCR.x;
          let bottom = bottomLeft + (bottomRight - bottomLeft) * fracCR.x;
          let newValue = top + (bottom - top) * fracCR.y;
          setOutputAtIndex(index, newValue);
        } else {
          // Compute the coordinators of nearest neighbor point.
          let sourceNearestCR = vec2<i32>(floor(
            sourceFracIndexCR + vec2<f32>(0.5,0.5)));
          let newValue = getImage(
            bInd, sourceNearestCR.y, sourceNearestCR.x, d);
          setOutputAtIndex(index, newValue);
        }
      }
    }
    `}}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
;const Ls={kernelName:Ge,backendName:`webgpu`,kernelFunc:e=>{let{inputs:t,backend:n,attrs:r}=e,{image:i,boxes:a,boxInd:o}=t,{cropSize:s,method:c,extrapolationValue:l}=r,u=new Is(i.shape[3],a.shape,s,c),d=[{type:`float32`,data:[l]}];return n.runWebGPUProgram(u,[i,a,o],`float32`,d)}};
/**
* @license
* Copyright 2022 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Rs;(function(e){e.Prod=`*`,e.Sum=`+`})(Rs||={});var zs=class{constructor(e,t,n,r){this.variableNames=[`x`],this.uniforms=`index : f32,`,this.size=!0,this.workgroupSize=[128,1,1],this.outputShape=t,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.exclusive=n,this.reverse=r,this.op=e,this.shaderKey=`cum_${this.op}_${this.exclusive}_${this.reverse}`}getUserCode(){let e=this.outputShape.length,t=this.op===Rs.Prod?`1.0`:`0.0`,n=this.exclusive?t:`getX(${Bs(e,`coords`,this.op)})`,r=this.outputShape[this.outputShape.length-1],i=``,a=``;return this.exclusive?(i=this.reverse?`end != ${r-1}`:`end != 0`,a=this.reverse?`end + 1`:`end - 1`):(i=this.reverse?`end + pow2 < ${r}`:`end >= pow2`,a=this.reverse?`end + pow2`:`end - pow2`),`
      ${B(`index`)} {
       if (index < uniforms.size) {
         var coords = getCoordsFromIndex(index);

         let end = ${Vs(e,`coords`,this.op)};
         var val = ${n};
         let pow2 = i32(pow(2.0, uniforms.index));
         if (${i}) {
           let idx = ${a};
           ${Vs(e,`coords`,this.op)} = idx;
           val ${this.op}= getX(${Bs(e,`coords`,this.op)});
         }
         setOutputAtIndex(index, val);
       }
      }
    `}};function Bs(e,t,n){if(e===1)return`${t}`;if(e===2)return`${t}.x, ${t}.y`;if(e===3)return`${t}.x, ${t}.y, ${t}.z`;if(e===4)return`${t}.x, ${t}.y, ${t}.z, ${t}.w`;throw Error(`Cumulative ${n} for rank ${e} is not yet supported`)}function Vs(e,t,n){if(e===1)return`${t}`;if(e===2)return`${t}.y`;if(e===3)return`${t}.z`;if(e===4)return`${t}.w`;throw Error(`Cumulative ${n} for rank ${e} is not yet supported`)}
/**
* @license
* Copyright 2022 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Hs(e,t,n,r,i,a){let o=t.shape.length,s=c([r],o),l=t;s!=null&&(l=$({inputs:{x:t},backend:n,attrs:{perm:s}}));let u=nt(1,o)[0];if(u!==o-1)throw Error(`WebGPU cumprod shader expects an inner-most axis=${t.shape.length-1} but got axis=${r}`);let d=l.shape[u],f=X({inputs:{x:l},backend:n});for(let t=0;t<=Math.ceil(Math.log2(d))-1;t++){let r=new zs(e,l.shape,!1,a),i=f,o=[{type:`float32`,data:[t]}];f=n.runWebGPUProgram(r,[f],f.dtype,o),n.disposeData(i.dataId)}if(i){let t=new zs(e,l.shape,i,a),r=f;f=n.runWebGPUProgram(t,[f],f.dtype,[{type:`float32`,data:[0]}]),n.disposeData(r.dataId)}if(s!=null){let e=ne(s),t=$({inputs:{x:f},backend:n,attrs:{perm:e}});return n.disposeData(f.dataId),n.disposeData(l.dataId),t}return f}
/**
* @license
* Copyright 2022 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Us(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{axis:a,exclusive:o,reverse:s}=r;return Hs(Rs.Prod,i,n,a,o,s)}const Ws={kernelName:wr,backendName:`webgpu`,kernelFunc:Us};
/**
* @license
* Copyright 2022 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Gs(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{axis:a,exclusive:o,reverse:s}=r;return Hs(Rs.Sum,i,n,a,o,s)}const Ks={kernelName:d,backendName:`webgpu`,kernelFunc:Gs};
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function qs(e){let{inputs:t,backend:n,attrs:r}=e,{x:i,weights:a}=t,{size:o,binaryOutput:s}=r,c=i.shape.length===1,l=N(a.shape)>0,u=a.dtype,d=c?[i.shape[0]]:[i.shape[0],i.shape[1]],f=J({backend:n,attrs:{shape:c?[o]:[i.shape[0],o],value:0,dtype:u}}),p=new Ao(d,l,s),m=[{type:`int32`,data:[o]}],h=l?[i,a]:[i];return n.runWebGPUProgram(p,h,u,m,f)}const Js={kernelName:it,backendName:`webgpu`,kernelFunc:qs};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Ys=class{constructor(e,t){this.variableNames=[`x`],this.workgroupSize=[64,1,1],this.size=!0,this.uniforms=`blockSize : i32,`,this.outputShape=e,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey=`depthToSpace_${t}`,this.dataFormat=t}getUserCode(){return`
      ${B(`index`)} {
        if (index < uniforms.size) {
          let coords = getCoordsFromIndex(index);
          let b = coords[0];
          let h = ${this.getHeightCoordString()};
          let w = ${this.getWidthCoordString()};
          let d = ${this.getDepthCoordString()};

          let in_h = h / uniforms.blockSize;
          let offset_h = h % uniforms.blockSize;
          let in_w = w / uniforms.blockSize;
          let offset_w = w % uniforms.blockSize;
          let offset_d = (offset_h * uniforms.blockSize + offset_w) *
            ${this.getOutputDepthSize()};
          let in_d = d + offset_d;

          let rlt = ${this.getInputSamplingString()};
          setOutputAtIndex(index, rlt);
        }
      }`}getHeightCoordString(){return this.dataFormat===`NHWC`?`coords[1]`:`coords[2]`}getWidthCoordString(){return this.dataFormat===`NHWC`?`coords[2]`:`coords[3]`}getDepthCoordString(){return this.dataFormat===`NHWC`?`coords[3]`:`coords[1]`}getOutputDepthSize(){return this.dataFormat===`NHWC`?`uniforms.outShape[3]`:`uniforms.outShape[1]`}getInputSamplingString(){return this.dataFormat===`NHWC`?`getX(b, in_h, in_w, in_d)`:`getX(b, in_d, in_h, in_w)`}};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Xs(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{blockSize:a,dataFormat:o}=r,s=i.shape[0],c=o===`NHWC`?i.shape[1]:i.shape[2],l=o===`NHWC`?i.shape[2]:i.shape[3],u=o===`NHWC`?i.shape[3]:i.shape[1],d=c*a,f=l*a,p=u/(a*a),m=o===`NHWC`?[s,d,f,p]:[s,p,d,f],h=[{type:`int32`,data:[a]}],g=new Ys(m,o);return n.runWebGPUProgram(g,[i],i.dtype,h)}const Zs={kernelName:ae,backendName:`webgpu`,kernelFunc:Xs};
/**
* @license
* Copyright 2022 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Qs=class{constructor(e,t,n,r=!1,i=null,a=!1){this.variableNames=[`x`,`W`],this.uniforms=`pads : vec2<i32>, inDims : vec2<i32>,`,this.workgroupSize=[16,16,1],this.outputShape=e,this.dispatchLayout={x:[3],y:[2],z:[0,1]},this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),r&&this.variableNames.push(`bias`),a&&this.variableNames.push(`preluActivationWeights`),this.addBias=r,this.activation=i,this.hasPreluActivation=a,this.filterHeight=t,this.filterWidth=n,this.shaderKey=`depthwiseNCHW_${this.activation}_${this.filterHeight}_${this.filterWidth}`}getUserCode(){let e=this.filterWidth*this.filterHeight,t=this.workgroupSize[0]*this.workgroupSize[1]*this.workgroupSize[2],n=this.workgroupSize[1]+this.filterHeight-1,r=this.workgroupSize[0]+this.filterWidth-1;return`
      ${q(this.activation,this.hasPreluActivation,!1,4)}

      var<workgroup> mm_Asub : array<array<f32, ${r}>, ${n}>;
      var<workgroup> mm_Bsub : array<array<f32, ${this.filterWidth}>, ${this.filterHeight}>;
      fn readX(batch : i32, channel : i32, row : i32, col : i32) -> f32 {
        var value = 0.0;
        if (row >=0 && row < uniforms.inDims[0] && col >=0 && col < uniforms.inDims[1])
        {
          value = getX(batch, channel, row, col);
        }
        return value;
      }

      ${B()} {
        let coords = getOutputCoords();
        let batch = coords[0];
        let xRCCorner = vec2<i32>(coords.zw) - uniforms.pads;
        let channelMul = uniforms.wShape[3];
        let d1 = coords[1] / channelMul;
        let q = coords[1] % channelMul;

        let inputRowStart = xRCCorner.x;
        let inputColStart = xRCCorner.y;

        let localRow = i32(localId.y);
        let localCol = i32(localId.x);

        // Load one tile of X into local memory.
        for (var inputRow = localRow; inputRow < ${n}; inputRow = inputRow + ${this.workgroupSize[1]}) {
          for (var inputCol = localCol; inputCol < ${r}; inputCol = inputCol + ${this.workgroupSize[0]}) {
            let rowOffset = inputRow - localRow;
            let colOffset = inputCol - localCol;
            mm_Asub[inputRow][inputCol] = readX(batch, d1, inputRowStart + rowOffset, inputColStart + colOffset);
          }
        }

        // Load one tile of W into local memory.
        var wIndex = i32(localIndex);
        ${e<t?`if (wIndex < ${e})`:`for(; wIndex < ${e}; wIndex = wIndex + ${t})`}

        {
          let wRow = wIndex / ${this.filterWidth};
          let wCol = wIndex % ${this.filterWidth};
          mm_Bsub[wRow][wCol] = getW(wRow, wCol, d1, q);
        }

        workgroupBarrier();

        var value = 0.0;
        for (var wR = 0; wR < ${this.filterHeight}; wR = wR + 1) {
          for (var wC = 0; wC < ${this.filterWidth}; wC = wC + 1) {
            let xVal = mm_Asub[localRow + wR][localCol + wC];
            let wVal = mm_Bsub[wR][wC];
            value = fma(xVal, wVal, value);
          }
        }
        ${ui(this.addBias,this.activation)}
        if (coordsInBounds4D(coords, uniforms.outShape)) {
          setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
        }
      }
    `}},$s=class{constructor(e,t=!1,n=null,r=!1){
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
this.variableNames=[`x`,`W`],this.uniforms=`pads : vec2<i32>, inDims : vec2<i32>, virtualWidth : i32,`,this.workgroupSize=[64,1,1],this.workPerThread=4,this.outputComponent=4,this.outputShape=e.outShape,this.virtualWidth=Math.ceil(this.outputShape[2]/this.workPerThread)*this.workPerThread;let i=[this.outputShape[0],this.outputShape[1],this.virtualWidth,this.outputShape[3]];this.dispatchLayout=U(i),this.dispatch=H(this.dispatchLayout,i,this.workgroupSize,[this.outputComponent*this.workPerThread,1,1]),j(e.dataFormat===`channelsLast`,()=>`TODO: NCHW is unimplemented`),t&&this.variableNames.push(`bias`),r&&this.variableNames.push(`preluActivationWeights`),this.convInfo=e,this.addBias=t,this.activation=n,this.hasPreluActivation=r,this.shaderKey=`depthwiseVec4_${n}_${this.convInfo.filterHeight}_${this.convInfo.filterWidth}_${this.convInfo.strideHeight}_${this.convInfo.strideWidth}_${this.workPerThread}`}getUserCode(){let e=(this.workPerThread-1)*this.convInfo.strideWidth+this.convInfo.filterWidth,t=this.convInfo.strideHeight,n=this.convInfo.strideWidth;return`
      ${q(this.activation,this.hasPreluActivation,!0,4)}
      fn readX(batch : i32, row : i32, col : i32, channel : i32) -> vec4<f32> {
        var value = vec4<f32>(0.0);
        if (col >=0 && col < uniforms.inDims[1]) {
          value = getX(batch, row, col, channel);
        }
        return value;
      }

      ${B(`index`)} {
        let width0 = uniforms.outShape[3] / ${this.outputComponent};
        let d1 = (index % width0) * ${this.outputComponent};
        var index1 = index / width0;
        let width1 = uniforms.virtualWidth / ${this.workPerThread};
        let c = (index1 % width1) * ${this.workPerThread};
        index1 = index1 / width1;
        let r = index1 % uniforms.outShape[1];
        let batch = index1 / uniforms.outShape[1];

        let xRCCorner = vec2<i32>(r, c) * vec2<i32>(${t}, ${n}) - uniforms.pads;

        let xRCorner = xRCCorner.x;
        let xCCorner = xRCCorner.y;
        var xVals : array<vec4<f32>, ${e}>;
        var dotProd : array<vec4<f32>, ${this.workPerThread}>;
        for (var i = 0; i < ${this.workPerThread}; i++) {
          dotProd[i] = vec4<f32>(0.0);
        }

        // Use constant instead of uniform can give better performance.
        for (var wR = 0; wR < ${this.convInfo.filterHeight}; wR = wR + 1) {
          let xR = xRCorner + wR;
          if (xR >=0 && xR < uniforms.inDims[0]) {
            for (var i = 0; i < ${e}; i++) {
              xVals[i] = readX(batch, xR, xCCorner + i, d1);
            }
            for (var wC = 0; wC < ${this.convInfo.filterWidth}; wC = wC + 1) {
              let wValue = getW(wR, wC, d1, 0);
              for (var i = 0; i < ${this.workPerThread}; i++) {
                dotProd[i] = fma(xVals[i * ${n} + wC], wValue, dotProd[i]);
              }
            }
          }
        }

        for (var i = 0; i < ${this.workPerThread}; i = i + 1) {
          let coords = vec4<i32>(batch, r, c + i, d1);
          if (coordsInBounds4D(coords, uniforms.outShape)) {
            var value = dotProd[i];
            ${ui(this.addBias,this.activation)}
            setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
          }
        }
      }
    `}},ec=class{constructor(e,t=!1,n=null,r=!1){
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
this.variableNames=[`x`,`W`],this.uniforms=`pads : vec2<i32>, inDims : vec2<i32>, filterHeight : i32,
      filterWidth : i32, strides : vec2<i32>, dilations : vec2<i32>,`,this.workgroupSize=[256,1,1],this.size=!0,this.outputShape=e.outShape,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.isChannelsLast=e.dataFormat===`channelsLast`,t&&this.variableNames.push(`bias`),r&&this.variableNames.push(`preluActivationWeights`),this.convInfo=e,this.addBias=t,this.activation=n,this.hasPreluActivation=r,this.shaderKey=`depthwise_${this.activation}_${this.isChannelsLast}`}getUserCode(){let e=this.isChannelsLast?`getX(batch, xR, xC, d1);`:`getX(batch, d1, xR, xC);`;return`
      ${q(this.activation,this.hasPreluActivation,!1,4)}

      ${B(`index`)} {
        if (index < uniforms.size) {
          let coords = getOutputCoords();
          let batch = coords[0];
          let xRCCorner = vec2<i32>(coords.${this.isChannelsLast?`yz`:`zw`}) * uniforms.strides - uniforms.pads;
          let d2 = coords[${this.isChannelsLast?3:1}];
          let channelMul = uniforms.wShape[3];
          let d1 = d2 / channelMul;
          let q = d2 % channelMul;

          let inputRowStart = xRCCorner.x;
          let inputColStart = xRCCorner.y;
          let inputRowEnd = inputRowStart + uniforms.filterHeight *
              uniforms.dilations[0];
          let inputColEnd = inputColStart + uniforms.filterWidth *
              uniforms.dilations[1];

          // Convolve x(?, ?, d1)|x(d1, ?, ?) with w(:, :, d1, q) to get
          // y(yR, yC, d2)|y(d2, yR, yC). ? = to be determined. : = across all
          // values in that axis. x(?, ?, d1) and y(yR, yC, d2) is for NHWC.
          // x(d1, ?, ?) and y(d2, yR, yC) is for NCHW.
          var value = 0.0;

          // Extract if checking out of for loop for performance.
          if (inputRowStart >= 0 && inputColStart >= 0 &&
            inputRowEnd < uniforms.inDims[0] &&
                inputColEnd < uniforms.inDims[1]) {
              for (var wR = 0; wR < uniforms.filterHeight; wR = wR + 1) {
                let xR = inputRowStart + wR * uniforms.dilations[0];

                for (var wC = 0; wC < uniforms.filterWidth; wC = wC + 1) {
                  let xC = inputColStart + wC * uniforms.dilations[1];

                  let xVal = ${e};
                  let wVal = getW(wR, wC, d1, q);
                  value = value + xVal * wVal;
                }
              }
            } else {
              for (var wR = 0; wR < uniforms.filterHeight; wR = wR + 1) {
                let xR = inputRowStart + wR * uniforms.dilations[0];

                if (xR < 0 || xR >= uniforms.inDims[0]) {
                  continue;
                }

                for (var wC = 0; wC < uniforms.filterWidth; wC = wC + 1) {
                  let xC = inputColStart + wC * uniforms.dilations[1];

                  if (xC < 0 || xC >= uniforms.inDims[1]) {
                    continue;
                  }

                  let xVal = ${e};
                  let wVal = getW(wR, wC, d1, q);
                  value = value + xVal * wVal;
                }
              }
            }
            ${ui(this.addBias,this.activation)}
          setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
        }
      }
    `}};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function tc(e){let{inputs:t,backend:n,attrs:r}=e,{x:i,filter:a}=t,{strides:o,pad:s,dataFormat:c,dilations:l,dimRoundingMode:u}=r,d=lt(c),f=l;f??=[1,1];let p=D(i.shape,a.shape,o,f,s,u,!0,d),m=[{type:`int32`,data:[p.padInfo.top,p.padInfo.left]},{type:`int32`,data:[p.inHeight,p.inWidth]}],h=p.dataFormat===`channelsLast`,g;return!h&&p.inHeight>16&&p.inWidth>16&&p.strideHeight===1&&p.strideWidth===1&&p.dilationWidth===1&&p.dilationHeight===1&&p.inChannels===p.outChannels?g=new Qs(p.outShape,p.filterHeight,p.filterWidth):h&&p.outHeight>4&&p.outWidth>4&&p.strideWidth<=2&&p.inChannels===p.outChannels&&p.dilationHeight===1&&p.dilationWidth===1&&p.inChannels%4==0?(g=new $s(p),m.push({type:`int32`,data:[g.virtualWidth]})):(g=new ec(p),m.push({type:`int32`,data:[p.filterHeight]},{type:`int32`,data:[p.filterWidth]},{type:`int32`,data:[p.strideHeight,p.strideWidth]},{type:`int32`,data:[p.dilationHeight,p.dilationWidth]})),n.runWebGPUProgram(g,[i,a],i.dtype,m)}const nc={kernelName:tt,backendName:`webgpu`,kernelFunc:tc};
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var rc=class{constructor(e){this.variableNames=[`x`,`dy`],this.uniforms=`strides : vec2<i32>, pads : vec2<i32>, filterDims : vec2<i32>, outHeight : i32,
      outWidth : i32, inHeight : i32, inWidth : i32, batchSize : i32, channelMul : i32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e.filterShape,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey=`depthwise_conv2d_backprop_filter`}getUserCode(){return`
      ${B(`index`)} {
      if (index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        let wR = coords[0];
        let wC = coords[1];
        let d1 = coords[2];
        let dm = coords[3];
        let d2 = d1 * uniforms.channelMul + dm;

        var dotProd = 0.0;
        for (var b = 0; b < uniforms.batchSize; b++) {
          for (var yR = 0; yR < uniforms.outHeight; yR++) {
            let xR = wR + yR * uniforms.strides[0] - uniforms.pads[0];

            if (xR < 0 || xR >= uniforms.inHeight) {
              continue;
            }

            for (var yC = 0; yC < uniforms.outWidth; yC++) {
              let xC = wC + yC * uniforms.strides[1] - uniforms.pads[1];

              if (xC < 0 || xC >= uniforms.inWidth) {
                continue;
              }

              let dyValue = getDy(b, yR, yC, d2);
              let xValue = getX(b, xR, xC, d1);
              dotProd += xValue * dyValue;
            }
          }
        }
        setOutputAtIndex(index, dotProd);
      }
    }
    `}},ic=class{constructor(e){this.variableNames=[`dy`,`W`],this.uniforms=`strides : vec2<i32>, pads : vec2<i32>, filterDims : vec2<i32>,
       outHeight : i32, outWidth : i32, channelMul : i32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e.inShape,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey=`depthwise_conv2d_backprop_input`}getUserCode(){return`
      ${B(`index`)} {
      if (index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        let batch = coords[0];
        let d1 = coords[3];
        let dyCorner = coords.yz - uniforms.pads;
        let dyRCorner = dyCorner.x;
        let dyCCorner = dyCorner.y;

        var dotProd = 0.0;
        for (var wR = 0; wR < uniforms.filterDims[0]; wR++) {
          let dyR = f32(dyRCorner + wR) / f32(uniforms.strides[0]);

          if (dyR < 0.0 || dyR >= f32(uniforms.outHeight) || fract(dyR) > 0.0) {
            continue;
          }

          let idyR = i32(dyR);
          let wRPerm = uniforms.filterDims[0] - 1 - wR;

          for (var wC = 0; wC < uniforms.filterDims[1]; wC++) {
            let dyC = f32(dyCCorner + wC) / f32(uniforms.strides[1]);

            if (dyC < 0.0 || dyC >= f32(uniforms.outWidth) || fract(dyC) > 0.0) {
              continue;
            }

            let idyC = i32(dyC);
            let wCPerm = uniforms.filterDims[1] - 1 - wC;

            for (var dm = 0; dm < uniforms.channelMul; dm++) {
              let d2 = d1 * uniforms.channelMul + dm;
              let xValue = getDy(batch, idyR, idyC, d2);
              let wValue = getW(wRPerm, wCPerm, d1, dm);
              dotProd += xValue * wValue;
            }
          }
        }
        setOutputAtIndex(index, dotProd);
      }
    }
    `}};
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ac(e){let{inputs:t,backend:n,attrs:r}=e,{x:i,dy:a}=t,{strides:o,dilations:s,pad:c,dimRoundingMode:l,filterShape:u}=r,d=D(i.shape,u,o,s,c,l,!0),f=new rc(d),p=[{type:`int32`,data:[d.strideHeight,d.strideWidth]},{type:`int32`,data:[d.padInfo.top,d.padInfo.left]},{type:`int32`,data:[d.filterHeight,d.filterWidth]},{type:`int32`,data:[d.outHeight]},{type:`int32`,data:[d.outWidth]},{type:`int32`,data:[d.inHeight]},{type:`int32`,data:[d.inWidth]},{type:`int32`,data:[d.batchSize]},{type:`int32`,data:[d.outChannels/d.inChannels]}];return n.runWebGPUProgram(f,[i,a],`float32`,p)}const oc={kernelName:ct,backendName:`webgpu`,kernelFunc:ac};
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function sc(e){let{inputs:t,backend:n,attrs:r}=e,{dy:i,filter:a}=t,{strides:o,dilations:s,pad:c,dimRoundingMode:l,inputShape:u}=r,d=D(u,a.shape,o,s,c,l,!0),f=new ic(d),p=[{type:`int32`,data:[d.strideHeight,d.strideWidth]},{type:`int32`,data:[d.filterHeight-1-d.padInfo.top,d.filterWidth-1-d.padInfo.left]},{type:`int32`,data:[d.filterHeight,d.filterWidth]},{type:`int32`,data:[d.outHeight]},{type:`int32`,data:[d.outWidth]},{type:`int32`,data:[d.outChannels/d.inChannels]}];return n.runWebGPUProgram(f,[i,a],i.dtype,p)}const cc={kernelName:te,backendName:`webgpu`,kernelFunc:sc};
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var lc=class{constructor(e){this.variableNames=[`x`],this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=[e,e],this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey=`diag`}getUserCode(){return`
      ${B(`index`)} {
        if (index < uniforms.size) {
          let coords = getOutputCoords();
          let value = select(0.0, getX(coords[0]), coords[0] == coords[1]);
          setOutputAtIndex(index, value);
        }
      }
    `}};
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function uc(e){let{inputs:t,backend:n}=e,{x:r}=t,i=[...r.shape,...r.shape],a=N(r.shape),o=Y({inputs:{x:r},backend:n,attrs:{shape:[a]}}),s=new lc(a),c=n.runWebGPUProgram(s,[o],o.dtype),l=Y({inputs:{x:c},backend:n,attrs:{shape:i}});return n.disposeData(o.dataId),n.disposeData(c.dataId),l}const dc={kernelName:_e,backendName:`webgpu`,kernelFunc:uc};
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var fc=class{constructor(e){this.variableNames=[`x`,`w`],this.uniforms=`filterDims: vec2<i32>, pads: vec2<i32>, strides: vec2<i32>, dilations: vec2<i32>`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e.outShape,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey=`dilation2d`}getUserCode(){return`
       ${B(`index`)} {
         if (index < uniforms.size) {
           let neg_infinity = -3.4e38;
           let coords = getOutputCoords();
           let batch = coords.x;
           let d1 = coords.w;
           let outTopLeftCorner = coords.yz * uniforms.strides - uniforms.pads;
           let hBeg = outTopLeftCorner.x;
           let wBeg = outTopLeftCorner.y;

           var curVal = neg_infinity;
           for (var h = 0; h < uniforms.filterDims[0]; h = h + 1) {
             let hIn = hBeg + h * uniforms.dilations[0];

             if (hIn >= 0 && hIn < uniforms.xShape[1]) {
               for (var w = 0; w < uniforms.filterDims[1]; w = w + 1) {
                 let wIn = wBeg + w * uniforms.dilations[1];

                 if (wIn >= 0 && wIn < uniforms.xShape[2]) {
                   let val = getX(batch, hIn, wIn, d1) + getW(h, w, d1);
                   if (val > curVal) {
                     curVal = val;
                   }
                 }
               }
             }
           }

           setOutputAtIndex(index, curVal);
         }
       }
     `}};
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function pc(e){let{inputs:t,backend:n,attrs:r}=e,{x:i,filter:a}=t,{strides:o,pad:s,dilations:c}=r,l=Rn(i.shape,a.shape,o,s,`NHWC`,c),u=[l.padInfo.top,l.padInfo.left],d=[{type:`int32`,data:[l.filterHeight,l.filterWidth]},{type:`int32`,data:[...u]},{type:`int32`,data:[l.strideHeight,l.strideWidth]},{type:`int32`,data:[l.dilationHeight,l.dilationWidth]}],f=new fc(l);return n.runWebGPUProgram(f,[i,a],i.dtype,d)}const mc={kernelName:Vn,backendName:`webgpu`,kernelFunc:pc};
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var hc=class{constructor(e,t){if(this.variableNames=[`x`,`w`,`dy`],this.uniforms=`filterDims: vec2<i32>, pads: vec2<i32>, strides: vec2<i32>, dilations: vec2<i32>, dySize: i32,`,this.workgroupSize=[64,1,1],this.atomic=!0,this.outputShape=e.inShape,this.dispatchLayout=U(e.outShape),this.dispatch=H(this.dispatchLayout,e.outShape,this.workgroupSize),t!==`float32`&&t!==`int32`)throw Error(`Dilation2DBackpropInput only supports float32 and int32
          types, does not support ${t} type.`);this.type=t,this.shaderKey=`dilation2DBackpropInput`}getUserCode(){return`
       ${B(`index`)} {
         if (index < uniforms.dySize) {
           let coords = getDyCoordsFromIndex(index);
           let b = coords[0];
           let r = coords[1];
           let c = coords[2];
           let d = coords[3];

           let dyCorner = vec2<i32>(r, c) * uniforms.strides - uniforms.pads;
           var curVal = -3.4e38;  // neg_infinity
           var xRMax = 0;
           var xCMax = 0;

           // In the case of multiple argmax branches, we only back-propagate
           // along the last branch, i.e., the one with largest value of
           // 'wR * uniforms.filterDims[1] + wC', similarly to the max-pooling
           // backward routines.
           for (var wR = 0; wR < uniforms.filterDims[0]; wR++) {
             let xR = dyCorner.x + wR * uniforms.dilations[0];

             if (xR >= 0 && xR < uniforms.xShape[1]) {
               for (var wC = 0; wC < uniforms.filterDims[1]; wC++) {
                 let xC = dyCorner.y + wC * uniforms.dilations[1];

                 if (xC >= 0 && xC < uniforms.xShape[2]) {
                   let val = getX(b, xR, xC, d) + getW(wR, wC, d);
                   if (val > curVal) {
                     curVal = val;
                     xRMax = xR;
                     xCMax = xC;
                   }
                 }
               }
             }
           }

           let flatIndexIn = d + uniforms.xShape[3] *
               (xCMax + uniforms.xShape[2] * (xRMax + uniforms.xShape[1] * b));
           let value = getDy(b, r, c, d);
           ${I(`&result[flatIndexIn]`,`value`,this.type)}
         }
       }
     `}},gc=class{constructor(e,t,n){if(this.variableNames=[`x`,`w`,`dy`],this.uniforms=`filterDims: vec2<i32>, pads: vec2<i32>, strides: vec2<i32>, dilations: vec2<i32>, dySize: i32,`,this.workgroupSize=[64,1,1],this.atomic=!0,this.outputShape=e.filterShape,this.dispatchLayout=U(e.outShape),this.dispatch=H(this.dispatchLayout,e.outShape,this.workgroupSize),n!==`float32`&&n!==`int32`)throw Error(`Dilation2DBackpropFilter only supports float32 and int32
          types, does not support ${n} type.`);this.type=n,this.shaderKey=`dilation2DBackpropFilter`}getUserCode(){return`
       ${B(`index`)} {
         if (index < uniforms.dySize) {
           let coords = getDyCoordsFromIndex(index);
           let b = coords[0];
           let r = coords[1];
           let c = coords[2];
           let d = coords[3];

           let dyCorner = vec2<i32>(r, c) * uniforms.strides - uniforms.pads;
           var curVal = -3.4e38;  // neg_infinity
           var wRMax = 0;
           var wCMax = 0;

           // In the case of multiple argmax branches, we only back-propagate
           // along the last branch, i.e., the one with largest value of
           // 'wR * uniforms.filterDims[1] + wC', similarly to the max-pooling
           // backward routines.
           for (var wR = 0; wR < uniforms.filterDims[0]; wR++) {
             let xR = dyCorner.x + wR * uniforms.dilations[0];

             if (xR >= 0 && xR < uniforms.xShape[1]) {
               for (var wC = 0; wC < uniforms.filterDims[1]; wC++) {
                 let xC = dyCorner.y + wC * uniforms.dilations[1];

                 if (xC >= 0 && xC < uniforms.xShape[2]) {
                   let val = getX(b, xR, xC, d) + getW(wR, wC, d);
                   if (val > curVal) {
                     curVal = val;
                     wRMax = wR;
                     wCMax = wC;
                   }
                 }
               }
             }
           }

           let flatIndexIn = d + uniforms.wShape[2] * (wCMax + wRMax * uniforms.wShape[1]);
           let value = getDy(b, r, c, d);
           ${I(`&result[flatIndexIn]`,`value`,this.type)}
         }
       }
     `}};
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function _c(e){let{inputs:t,backend:n,attrs:r}=e,{x:i,filter:a,dy:o}=t,{strides:s,pad:c,dilations:l}=r,u=Rn(i.shape,a.shape,s,c,`NHWC`,l),d=a.dtype,f=new gc(u,a.shape,d),p=[{type:`int32`,data:[u.filterHeight,u.filterWidth]},{type:`int32`,data:[u.padInfo.top,u.padInfo.left]},{type:`int32`,data:[u.strideHeight,u.strideWidth]},{type:`int32`,data:[u.dilationHeight,u.dilationWidth]},{type:`int32`,data:[N(u.outShape)]}],m=J({backend:n,attrs:{shape:a.shape,value:0,dtype:d}});return n.runWebGPUProgram(f,[i,a,o],d,p,m)}const vc={kernelName:pe,backendName:`webgpu`,kernelFunc:_c};
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function yc(e){let{inputs:t,backend:n,attrs:r}=e,{x:i,filter:a,dy:o}=t,{strides:s,pad:c,dilations:l}=r,u=Rn(i.shape,a.shape,s,c,`NHWC`,l),d=i.dtype,f=new hc(u,d),p=[{type:`int32`,data:[u.filterHeight,u.filterWidth]},{type:`int32`,data:[u.padInfo.top,u.padInfo.left]},{type:`int32`,data:[u.strideHeight,u.strideWidth]},{type:`int32`,data:[u.dilationHeight,u.dilationWidth]},{type:`int32`,data:[N(u.outShape)]}],m=J({backend:n,attrs:{shape:u.inShape,value:0,dtype:d}});return n.runWebGPUProgram(f,[i,a,o],d,p,m)}const bc={kernelName:gt,backendName:`webgpu`,kernelFunc:yc};
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var xc=class{constructor(e,t,n){this.variableNames=[`Image`],this.uniforms=`alpha: f32,`,this.workgroupSize=[64,1,1],this.pixelsOpType=Mr.DRAW,this.size=!0,this.outputShape=e,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.type=t,this.textureFormat=n,this.shaderKey=`draw_${t}_${n}`}getUserCode(){let e,t=this.type===`float32`?`value`:`value / 255.0`;return e=`
      if (uniforms.numChannels == 1) {
        rgba[0] = ${t};
        rgba[1] = ${t};
        rgba[2] = ${t};
      } else {
        rgba[d] = ${t};
      }`,`
       @group(0) @binding(0) var outImage : texture_storage_2d<${this.textureFormat}, write>;
       ${B(`index`)} {
         if (index < uniforms.size) {
           var rgba = vec4<f32>(0.0, 0.0, 0.0, uniforms.alpha);
           for (var d = 0; d < uniforms.numChannels; d = d + 1) {
             let value = f32(inBuf[index * uniforms.numChannels + d]);
             ${e}
           }
           rgba.x = rgba.x * rgba.w;
           rgba.y = rgba.y * rgba.w;
           rgba.z = rgba.z * rgba.w;
           let coords = getCoordsFromIndex(index);
           textureStore(outImage, vec2<i32>(coords.yx), rgba);
         }
       }
      `}};
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use backend file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Sc(e){let{inputs:t,backend:n,attrs:r}=e,{image:i}=t,{canvas:a,options:o}=r,[s,c]=i.shape.slice(0,2),{imageOptions:l}=o||{},u=l?.alpha||1,d=n.device.features.has(`bgra8unorm-storage`)?`bgra8unorm`:`rgba8unorm`,f=[s,c],p=new xc(f,i.dtype,d);a.width=c,a.height=s;let m=`webgpu`,h=a.getContext(m),g;h||=(g=new OffscreenCanvas(c,s),g.getContext(m));let _=i.shape.length===3?i.shape[2]:1;h.configure({device:n.device,format:d,usage:GPUTextureUsage.STORAGE_BINDING,alphaMode:`premultiplied`});let v=`int32`,y=n.makeTensorInfo(f,v),b=n.tensorMap.get(y.dataId);b.resource=h.getCurrentTexture(),b.external=!0;let x=[{type:`uint32`,data:[_]},{type:`float32`,data:[u]}];if(n.runWebGPUProgram(p,[i],v,x,y),g){let e=a.getContext(`2d`);if(!e)throw Error(`Please make sure this canvas has only been used for 2d or webgpu context!`);e.drawImage(g,0,0)}return n.disposeData(y.dataId),i}const Cc={kernelName:ft,backendName:`webgpu`,kernelFunc:Sc},wc=Q({opType:G.MUL,cpuKernelImpl:aa,supportsComplex:!0}),Tc={kernelName:Sr,backendName:`webgpu`,kernelFunc:wc}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
;
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ec(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{axis:a,keepDims:o}=r;return Ia(i,a,o,`sum`,n)}const Dc={kernelName:`Sum`,backendName:`webgpu`,kernelFunc:Ec};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Oc(e){let{inputs:t,backend:n,attrs:r}=e,{equation:i}=r,a=t,{allDims:o,summedDims:s,idDims:c}=qn(i,a.length);An(o.length,c,a);let{path:l,steps:u}=Pt(s,c),d=u.length,f=null,p=o.length,m=[];for(let e=0;e<d;++e){for(let t of u[e]){let{permutationIndices:e,expandDims:r}=vn(p,c[t]),i;tr(e)?i=a[t]:(i=$({inputs:{x:a[t]},backend:n,attrs:{perm:e}}),m.push(i));let o=i.shape.slice();for(let e=0;e<r.length;++e)o.splice(r[e],0,1);ie(i.shape,o)||(i=Y({inputs:{x:i},backend:n,attrs:{shape:o}}),m.push(i)),f===null?f=i:(f=wc({inputs:{a:i,b:f},backend:n}),m.push(f))}e<d-1&&(l[e]>=0&&(f=Ec({inputs:{x:f},backend:n,attrs:{axis:l[e]-(o.length-p),keepDims:!1}}),m.push(f)),p--)}for(let e of m)e!==f&&n.disposeData(e.dataId);return f}const kc={kernelName:bt,backendName:`webgpu`,kernelFunc:Oc},Ac={kernelName:`Elu`,backendName:`webgpu`,kernelFunc:Z({opType:K.ELU})},jc={kernelName:Ve,backendName:`webgpu`,kernelFunc:e=>{
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
let{inputs:t,backend:n}=e,{dy:r,y:i}=t,a=new Fi(G.ELU_DER,r.shape,i.shape);return n.runWebGPUProgram(a,[r,i],r.dtype)}},Mc=Q({opType:G.EQUAL,dtype:`bool`,cpuKernelImpl:Wi}),Nc={kernelName:r,backendName:`webgpu`,kernelFunc:Mc},Pc={kernelName:`Erf`,backendName:`webgpu`,kernelFunc:Z({opType:K.ERF})},Fc={kernelName:`Exp`,backendName:`webgpu`,kernelFunc:Z({opType:K.EXP,cpuKernelImpl:Gi,dtype:`float32`})}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
;
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the License);
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an AS IS BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ic(e){let{inputs:t,attrs:n,backend:r}=e,{dim:i}=n,{input:a}=t,o=a.shape.length,s=a.shape.slice(),c=i;return i<0&&(j(-(o+1)<=i,()=>`Axis must be in the interval [${-(o+1)}, ${o}]`),c=o+i+1),s.splice(c,0,1),Y({inputs:{x:a},backend:r,attrs:{shape:s}})}const Lc={kernelName:Ut,backendName:`webgpu`,kernelFunc:Ic},Rc=Z({opType:K.EXPM1,cpuKernelImpl:Ki}),zc={kernelName:Qn,backendName:`webgpu`,kernelFunc:Rc}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
;
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Bc=class{constructor(e,t){this.variableNames=[`real`,`imag`],this.outputShape=[],this.uniforms=`exponentMultiplier : f32, denominator: f32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.component=e,this.shaderKey=`fft_${e}`}getUserCode(){return`
    fn unaryOpComplex(real: f32, expR: f32, imag: f32, expI: f32) -> f32 {
      ${this.component===`real`?`return real * expR - imag * expI;`:`return real * expI + imag * expR;`}
    }

    fn mulMatDFT(batch: i32, index: i32) -> f32 {
      let indexRatio = f32(index) / f32(uniforms.realShape[1]);
      let exponentMultiplierTimesIndexRatio =
          uniforms.exponentMultiplier * indexRatio;

      var result = 0.0;

      for (var i = 0; i < uniforms.realShape[1]; i = i + 1) {
        // x = (-2|2 * PI / N) * index * i;
        let x = exponentMultiplierTimesIndexRatio * f32(i);
        let expR = cos(x);
        let expI = sin(x);
        let real = getReal(batch, i);
        let imag = getImag(batch, i);

        result = result +
            unaryOpComplex(real, expR, imag, expI) / uniforms.denominator;
      }

      return result;
    }

    ${B(`index`)} {
      if (index < uniforms.size) {
        let coords = getOutputCoords();
        setOutputAtIndex(index, mulMatDFT(coords[0], coords[1]));
      }
    }
  `}};
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Vc(e,t,n){let r=n.tensorMap.get(e.dataId),i=N(e.shape),a=e.shape[e.shape.length-1],o=i/a,s=[],c=Y({inputs:{x:e},backend:n,attrs:{shape:[o,a]}});s.push(c);let l=c.shape,u=new Bc(`real`,l),d=new Bc(`imag`,l),f=[{dataId:r.complexTensorInfos.real.dataId,dtype:r.complexTensorInfos.real.dtype,shape:l},{dataId:r.complexTensorInfos.imag.dataId,dtype:r.complexTensorInfos.imag.dtype,shape:l}],p=t?2*Math.PI:-2*Math.PI,m=t?l[1]:1,h=[{type:`float32`,data:[p]},{type:`float32`,data:[m]}],g=n.runWebGPUProgram(u,f,`float32`,h);s.push(g);let _=n.runWebGPUProgram(d,f,`float32`,h);s.push(_);let v=Li({inputs:{real:g,imag:_},backend:n});s.push(v);let y=Y({inputs:{x:v},backend:n,attrs:{shape:e.shape}});return s.forEach(e=>n.disposeData(e.dataId)),y}
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Hc(e){let{inputs:t,backend:n}=e,{input:r}=t;return Vc(r,!1,n)}const Uc={kernelName:`FFT`,backendName:`webgpu`,kernelFunc:Hc};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Wc=class{constructor(e){this.outputShape=[],this.variableNames=[`x`],this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey=`flipLeftRight`}getUserCode(){return`
      ${B(`index`)} {
        if (index < uniforms.size) {
          let coords = getCoordsFromIndex(index);
          let coordX = uniforms.xShape[2] - coords[2] - 1;
          let outputValue = getX(coords[0], coords[1], coordX, coords[3]);
          setOutputAtIndex(index, outputValue);
        }
      }
    `}};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
const Gc={kernelName:Wn,backendName:`webgpu`,kernelFunc:({inputs:e,backend:t})=>{let{image:n}=e,r=t,i=new Wc(n.shape);return r.runWebGPUProgram(i,[n],n.dtype)}},Kc=Z({opType:K.FLOOR,cpuKernelImpl:qi}),qc={kernelName:sn,backendName:`webgpu`,kernelFunc:Kc},Jc=Q({opType:G.FLOOR_DIV,cpuKernelImpl:Ji,dtype:`int32`}),Yc={kernelName:Dt,backendName:`webgpu`,kernelFunc:Jc}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
;
/**
* @license
* Copyright 2022 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Xc=class{constructor(e,t,n=!1){this.pixelsOpType=Mr.FROM_PIXELS,this.outputShape=[0],this.variableNames=[],this.workgroupSize=[256,1,1],this.outputShape=e,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize,[t,1,1]),this.importVideo=n,this.shaderKey=`fromPixels_${this.importVideo}`}getUserCode(){let e=this.importVideo?`textureLoad(src, vec2<i32>(coords.yx));`:`textureLoad(src, vec2<i32>(coords.yx), 0)`;return`
      @binding(1) @group(0) var src: ${this.importVideo?`texture_external`:`texture_2d<f32>`};
      ${B(`index`)} {
        let flatIndex = index * uniforms.numChannels;
        if (flatIndex < uniforms.size) {
          let coords = getCoordsFromIndex(flatIndex);
          let values = ${e};
          for (var i = 0; i < uniforms.numChannels; i = i + 1) {
            result[flatIndex + i] = i32(floor(255.0 * values[i]));
          }
        }
      }
  `}};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use backend file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
const Zc={kernelName:jn,backendName:`webgpu`,kernelFunc:el};let Qc,$c=M().getBool(`CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU`);function el(e){let{inputs:t,backend:n,attrs:r}=e,{pixels:i}=t,{numChannels:a}=r;if(i==null)throw Error(`pixels passed to tf.browser.fromPixels() can not be null`);let o=typeof HTMLVideoElement<`u`&&i instanceof HTMLVideoElement,s=typeof HTMLImageElement<`u`&&i instanceof HTMLImageElement,c=typeof HTMLCanvasElement<`u`&&i instanceof HTMLCanvasElement||typeof OffscreenCanvas<`u`&&i instanceof OffscreenCanvas,l=typeof ImageBitmap<`u`&&i instanceof ImageBitmap,[u,d]=o?[i.videoWidth,i.videoHeight]:[i.width,i.height],f=[d,u,a],p=M().getBool(`WEBGPU_IMPORT_EXTERNAL_TEXTURE`)&&o,m=o||s;if(l||c||m){let e;if(p)e=n.device.importExternalTexture({source:i});else{if(m){let e=M().getBool(`CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU`);(Qc==null||e!==$c)&&($c=e,Qc=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:$c})),Qc.canvas.width=u,Qc.canvas.height=d,Qc.drawImage(i,0,0,u,d),i=Qc.canvas}let t=GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING,r=n.textureManager.acquireTexture(f[1],f[0],`rgba8unorm`,t);n.queue.copyExternalImageToTexture({source:i},{texture:r},[f[1],f[0]]),e=r}let t=N(f),r=k(f),o=new Xc(f,a,p),s=[{type:`uint32`,data:[t]},{type:`uint32`,data:[a]},{type:`uint32`,data:[...r]}],c=n.makeTensorInfo([d,u],`int32`),l=n.tensorMap.get(c.dataId);l.resource=e;let h=n.runWebGPUProgram(o,[c],`int32`,s);return n.disposeData(c.dataId),h}let h=i.data,g=h;if(a!=null&&a!==4){g=new Uint8Array(i.width*i.height*a);let e=h.length,t=0;for(let n=0;n<e;n++)n%4<a&&(g[t++]=h[n])}let _=n.makeTensorInfo(f,`int32`,new Int32Array(g));return n.uploadToGPU(_.dataId),_}
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var tl=class{constructor(e,t,n,r,i){this.uniforms=`varianceEpsilon : f32,`,this.workgroupSize=[128,1,1],this.size=!0,this.variableNames=[`x`,`mean`,`variance`],A(e,t),A(e,n),this.outputShape=e,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),r!=null&&(A(e,r),this.variableNames.push(`offset`)),i!=null&&(A(e,i),this.variableNames.push(`scale`)),this.offsetShape=r,this.scaleShape=i,this.shaderKey=`batchNorm`}getUserCode(){let e=`0.0`;this.offsetShape!=null&&(e=`getOffsetByOutputIndex(index)`);let t=`1.0`;return this.scaleShape!=null&&(t=`getScaleByOutputIndex(index)`),`
      ${B(`index`)} {
        if (index < uniforms.size)
        {
          let xValue = getXByOutputIndex(index);
          let meanValue = getMeanByOutputIndex(index);
          let varianValue = getVarianceByOutputIndex(index);
          let offsetValue = ${e};
          let scaleValue = ${t};
          let inv = scaleValue * inverseSqrt(varianValue + f32(uniforms.varianceEpsilon));
          setOutputAtIndex(index,dot(vec3<f32>(xValue, -meanValue, offsetValue), vec3<f32>(inv, inv, 1.0)));
        }
      }
  `}};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
const nl={kernelName:Jn,backendName:`webgpu`,kernelFunc:({inputs:e,attrs:t,backend:n})=>{let{x:r,scale:i,offset:a,mean:o,variance:s}=e,{varianceEpsilon:c}=t,l=n,u=[r,o,s],d=null;a!=null&&(d=a.shape,u.push(a));let f=null;i!=null&&(f=i.shape,u.push(i));let p=new tl(r.shape,o.shape,s.shape,d,f),m=[{type:`float32`,data:[c]}];return l.runWebGPUProgram(p,u,r.dtype,m)}};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function rl(e){let{inputs:t,backend:n,attrs:r}=e,{x:i,filter:a,bias:o,preluActivationWeights:s}=t,{strides:c,pad:l,dataFormat:u,dilations:d,dimRoundingMode:f,activation:p,leakyreluAlpha:m}=r,h=lt(u);return ps({x:i,filter:a,convInfo:D(i.shape,a.shape,c,d,l,f,!1,h),backend:n,bias:o,preluActivationWeights:s,leakyreluAlpha:m,activation:p})}const il={kernelName:Ft,backendName:`webgpu`,kernelFunc:rl};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function al(e){let{inputs:t,backend:n,attrs:r}=e,{x:i,filter:a,bias:o,preluActivationWeights:s}=t,{strides:c,pad:l,dilations:u,dimRoundingMode:d,activation:f,leakyreluAlpha:p}=r,m=u;m??=[1,1],j(_t(c,m),()=>`Error in depthwiseConv2d: Either strides or dilations must be 1. Got strides ${c} and dilations '${m}'`);let h=D(i.shape,a.shape,c,m,l,d,!0),g=[i,a],_=o!=null,v=s!=null;_&&g.push(o),v&&g.push(s);let y=[{type:`int32`,data:[h.padInfo.top,h.padInfo.left]},{type:`int32`,data:[h.inHeight,h.inWidth]}],b;return h.outHeight>4&&h.outWidth>4&&h.strideWidth<=2&&h.inChannels===h.outChannels&&h.dilationHeight===1&&h.dilationWidth===1&&h.inChannels%4==0?(b=new $s(h,_,f,v),y.push({type:`int32`,data:[b.virtualWidth]})):(b=new ec(h,_,f,v),y.push({type:`int32`,data:[h.filterHeight]},{type:`int32`,data:[h.filterWidth]},{type:`int32`,data:[h.strideHeight,h.strideWidth]},{type:`int32`,data:[h.dilationHeight,h.dilationWidth]})),f===`leakyrelu`&&(y.push({type:`float32`,data:[p]}),b.uniforms+=` alpha : f32,`),n.runWebGPUProgram(b,g,`float32`,y)}const ol={kernelName:yn,backendName:`webgpu`,kernelFunc:al};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var sl=class{constructor(e,t){this.variableNames=[`A`,`indices`],this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey=`gathernd_${e}`,this.sliceDim=e,this.uniforms=`sliceDim : i32, strides : ${R(e)},`}getUserCode(){let e;return e=this.sliceDim>1?`uniforms.strides[j]`:`uniforms.strides`,`
      ${B(`index`)} {
        if (index < uniforms.size) {
          let coords = getCoordsFromIndex(index);
          var flattenIndex = 0;
          for (var j = 0; j < uniforms.sliceDim; j = j + 1) {
            let indexTemp = i32(round(getIndices(coords[0], j)));
            let strideNum = ${e};
            flattenIndex = flattenIndex + indexTemp * strideNum;
          }

          setOutputAtIndex(index, getA(flattenIndex, coords[1]));
        }
      }
      `}};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function cl(e){let{inputs:t,backend:n}=e,{params:r,indices:i}=t,a=i.shape,o=a[a.length-1],s=N(r.shape),[c,l,u,d]=Se(r,i),f=Y({inputs:{x:i},backend:n,attrs:{shape:[l,o]}}),p=Y({inputs:{x:r},backend:n,attrs:{shape:[N(r.shape)/u,u]}});if(n.shouldExecuteOnCPU([r,i])||r.dtype===`string`){let e=n.readSync(i.dataId),t=n.bufferSync(r),a=Yi(e,t,r.dtype,l,o,u,d,r.shape,s);return n.makeTensorInfo(c,r.dtype,a.values)}let m=new sl(o,[l,u]),h=[{type:`int32`,data:[o]},{type:`int32`,data:d}],g=n.runWebGPUProgram(m,[p,f],p.dtype,h),_=Y({inputs:{x:g},backend:n,attrs:{shape:c}});return n.disposeData(f.dataId),n.disposeData(p.dataId),n.disposeData(g.dataId),_}const ll={kernelName:nr,backendName:`webgpu`,kernelFunc:cl};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var ul=class{constructor(e,t){this.variableNames=[`A`,`indices`],this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e.slice(),this.aShape=e,this.outputShape=t,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey=`gather`}getUserCode(){let e=dl(this.aShape);return`
      ${B(`index`)} {
        if (index < uniforms.size) {
          let resRC = getCoordsFromIndex(index);
          let indexZ = i32(getIndices(resRC.x, resRC.z));
          let inBounds = select(0.0, 1.0, indexZ >= 0 && indexZ < uniforms.aShape[2]);
          setOutputAtIndex(index, inBounds * getA(${e}));
        }
      }
    `}};function dl(e){let t=[`resRC.x`,`resRC.y`,`resRC.z`,`resRC.w`],n=[];for(let r=0;r<e.length;r++)r===2?n.push(`indexZ`):n.push(`${t[r]}`);return n.join()}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function fl(e){let{inputs:t,backend:n,attrs:r}=e,{x:i,indices:a}=t,{axis:o,batchDims:s}=r,c=P(o,i.shape)[0],l=Hn(i,a,c,s),u=N(a.shape),d=[],f=Y({inputs:{x:i},backend:n,attrs:{shape:[l.batchSize,l.outerSize,l.dimSize,l.sliceSize]}}),p=Y({inputs:{x:a},backend:n,attrs:{shape:[l.batchSize,u/l.batchSize]}});d.push(f),d.push(p);let m=[l.batchSize,l.outerSize,u/l.batchSize,l.sliceSize];if(n.shouldExecuteOnCPU([i,a])){let e=n.tensorMap.get(p.dataId).values,t=Re(p.shape,p.dtype,e),r=n.tensorMap.get(f.dataId).values,i=Re(f.shape,f.dtype,r),a=Xi(i,t,m);return d.forEach(e=>n.disposeData(e.dataId)),n.makeTensorInfo(l.outputShape,a.dtype,a.values)}let h=new ul(f.shape,m),g=n.runWebGPUProgram(h,[f,p],f.dtype);d.push(g);let _=Y({inputs:{x:g},backend:n,attrs:{shape:l.outputShape}});return d.forEach(e=>n.disposeData(e.dataId)),_}const pl={kernelName:zt,backendName:`webgpu`,kernelFunc:fl},ml=Q({opType:G.GREATER,cpuKernelImpl:Qi,dtype:`bool`}),hl={kernelName:qt,backendName:`webgpu`,kernelFunc:ml},gl=Q({opType:G.GREATER_EQUAL,dtype:`bool`,cpuKernelImpl:Zi}),_l={kernelName:Fn,backendName:`webgpu`,kernelFunc:gl}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
;
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function vl(e){let{inputs:t,backend:n}=e,{input:r}=t;return Vc(r,!0,n)}const yl={kernelName:Cn,backendName:`webgpu`,kernelFunc:vl},bl=Z({opType:K.IS_FINITE,dtype:`bool`}),xl={kernelName:St,backendName:`webgpu`,kernelFunc:bl},Sl=Z({opType:K.IS_INF,dtype:`bool`}),Cl={kernelName:or,backendName:`webgpu`,kernelFunc:Sl},wl=Z({opType:K.IS_NAN,dtype:`bool`}),Tl={kernelName:vr,backendName:`webgpu`,kernelFunc:wl}
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2022 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
;
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function El(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{alpha:a}=r,o=[{type:`float32`,data:[a]}],s=new zi(i.shape,K.LEAKYRELU,`alpha : f32,`);return n.runWebGPUProgram(s,[i],`float32`,o)}const Dl={kernelName:mr,backendName:`webgpu`,kernelFunc:El},Ol=Q({opType:G.LESS,dtype:`bool`,cpuKernelImpl:ea}),kl={kernelName:qe,backendName:`webgpu`,kernelFunc:Ol},Al=Q({opType:G.LESS_EQUAL,dtype:`bool`,cpuKernelImpl:$i}),jl={kernelName:p,backendName:`webgpu`,kernelFunc:Al}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
;
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Ml=class{constructor(e){this.variableNames=[],this.outputShape=[],this.uniforms=`start : f32, step : f32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=[e],this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey=`linSpace`}getUserCode(){return`
      ${B(`index`)} {
        if (index < uniforms.size) {
          setOutputAtIndex(index, uniforms.start + f32(index) * uniforms.step);
        }
      }
    `}};
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Nl(e){let{backend:t,attrs:n}=e,{start:r,stop:i,num:a}=n,o=(i-r)/(a-1),s=new Ml(a),c=[{type:`float32`,data:[r]},{type:`float32`,data:[o]}];return t.runWebGPUProgram(s,[],`float32`,c)}const Pl={kernelName:ur,backendName:`webgpu`,kernelFunc:Nl},Fl={kernelName:`Log`,backendName:`webgpu`,kernelFunc:Z({opType:K.LOG,cpuKernelImpl:ta})},Il=Z({opType:K.LOG1P}),Ll={kernelName:Ze,backendName:`webgpu`,kernelFunc:Il},Rl=Q({opType:G.LOGICAL_AND,dtype:`bool`}),zl={kernelName:x,backendName:`webgpu`,kernelFunc:Rl},Bl=Z({opType:K.LOGICAL_NOT}),Vl={kernelName:_,backendName:`webgpu`,kernelFunc:Bl},Hl=Q({opType:G.LOGICAL_OR}),Ul={kernelName:je,backendName:`webgpu`,kernelFunc:Hl},Wl=`
  var powValue = 0.0;
  let basis = uniforms.bias + uniforms.alpha * sum;
  if (uniforms.beta == 0.5) {
    powValue = inverseSqrt(basis);
  } else if (uniforms.beta == 1.0) {
    powValue = 1.0 / basis;
  } else {
    powValue = exp(log(basis) * (-uniforms.beta));
  }
`
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
;var Gl=class{constructor(e){this.outputShape=[],this.variableNames=[`x`],this.uniforms=`radius : i32, bias : f32, alpha : f32, beta : f32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey=`lrn`}getUserCode(){return`
    ${B(`index`)} {
      if (index < uniforms.size) {
        let coords = getOutputCoords();
        let b = coords[0];
        let r = coords[1];
        let c = coords[2];
        let d = coords[3];

        let x = getX(b, r, c, d);
        var sum = 0.0;
        for (var i = -uniforms.radius; i <= uniforms.radius; i = i + 1) {
          let idx = d + i;
          if (idx >= 0 && idx < uniforms.xShape[3]) {
            let z = getX(b, r, c, idx);
            sum = sum + z * z;
          }
        }
        ${Wl}

        setOutputAtIndex(index, x * powValue);
      }
    }
  `}},Kl=class{constructor(e,t){this.outputShape=[],this.variableNames=[`x`],this.uniforms=`radius : i32, bias : f32, alpha : f32, beta : f32,`,this.workgroupSize=[256,1,1],this.maxAllowRadius=16,j(t<=this.maxAllowRadius,()=>`Radius must be less than or equal to ${this.maxAllowRadius}, current radius is ${t}`),this.outputShape=e,this.elementsPerWorkgroup=this.workgroupSize[0]-2*this.maxAllowRadius,this.dispatchLayout={x:[3],y:[2],z:[0,1]},this.dispatch=H(this.dispatchLayout,this.outputShape,[this.elementsPerWorkgroup,this.workgroupSize[1],this.workgroupSize[2]]),this.shaderKey=`lrn_shared`}getUserCode(){return`
    var <workgroup>lrnSub: array<f32, ${this.workgroupSize[0]}>;
    const elementsPerWorkgroup = ${this.elementsPerWorkgroup};
    const maxAllowRadius = ${this.maxAllowRadius};

    ${B()} {
      let localDepth = i32(localId.x);
      let workgroupDepth = i32(workgroupId.x) * elementsPerWorkgroup;
      let xDepth = workgroupDepth + localDepth - maxAllowRadius;
      let b = i32(globalId.z) / uniforms.xShape[1];
      let r = i32(globalId.z) - b * uniforms.xShape[1];
      let c = i32(globalId.y);
      let d = workgroupDepth + localDepth;

      var x = 0.0;
      if (xDepth >= 0 && xDepth < uniforms.xShape[3]) {
        x = getX(b, r, c, xDepth);
      }
      lrnSub[localDepth] = x;
      workgroupBarrier();

      if (localDepth < elementsPerWorkgroup && d < uniforms.outShape[3]) {
        var sum = 0.0;
        let index = localDepth + maxAllowRadius;
        for (var i = -uniforms.radius; i <= uniforms.radius; i = i + 1) {
          let z = lrnSub[index + i];
          sum = sum + z * z;
        }
        ${Wl}

        setOutputAtCoords(b, r, c, d, lrnSub[index] * powValue);
      }
    } `}};
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ql(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{depthRadius:a,bias:o,alpha:s,beta:c}=r,l;l=a>16?new Gl(i.shape):new Kl(i.shape,a);let u=[{type:`int32`,data:[a]},{type:`float32`,data:[o]},{type:`float32`,data:[s]},{type:`float32`,data:[c]}];return n.runWebGPUProgram(l,[i],i.dtype,u)}const Jl={kernelName:`LRN`,backendName:`webgpu`,kernelFunc:ql};
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Yl=class{constructor(e){this.outputShape=[],this.variableNames=[`inputImage`,`outputImage`,`dy`],this.uniforms=`depthRadius : i32, bias : f32, alpha : f32, beta : f32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey=`lrn_grad`}getUserCode(){return`
    ${B(`index`)} {
      if (index < uniforms.size) {
        let coords = getOutputCoords();
        let b = coords[0];
        let r = coords[1];
        let c = coords[2];

        let MIN_DEPTH_BEGIN = 0;
        let MAX_DEPTH_END = uniforms.outShape[3];
        var result = 0.0;
        for (var d = MIN_DEPTH_BEGIN; d < MAX_DEPTH_END; d++) {
          let depthBegin = max(MIN_DEPTH_BEGIN, d - uniforms.depthRadius);
          let depthEnd = min(MAX_DEPTH_END, d + uniforms.depthRadius + 1);

          var norm = 0.0;
          for (var k = MIN_DEPTH_BEGIN; k < MAX_DEPTH_END; k++) {
            if (k < depthBegin) {
              continue;
            } else if (k >= depthBegin && k < depthEnd) {
              norm += getInputImage(b, r, c, k) * getInputImage(b, r, c, k);
            } else {
              break;
            }
          }

          norm = uniforms.alpha * norm + uniforms.bias;

          for (var k = MIN_DEPTH_BEGIN; k < MAX_DEPTH_END; k++) {
            if (k < depthBegin) {
              continue;
            } else if (k >= depthBegin && k < depthEnd) {
              var dyi = -2.0 * uniforms.alpha * uniforms.beta
                * getInputImage(b, r, c, k) * getOutputImage(b, r, c, d) / norm;
              if (k == d) {
                dyi += pow(norm, -1.0 * uniforms.beta);
              }
              if (k == coords[3]) {
                dyi *= getDy(b, r, c, d);
                result += dyi;
              }
            } else {
              break;
            }
          }
        }

        setOutputAtIndex(index, result);
      }
    }
  `}};
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Xl(e){let{inputs:t,backend:n,attrs:r}=e,{x:i,y:a,dy:o}=t,{depthRadius:s,bias:c,alpha:l,beta:u}=r,d=new Yl(i.shape),f=[{type:`int32`,data:[s]},{type:`float32`,data:[c]},{type:`float32`,data:[l]},{type:`float32`,data:[u]}];return n.runWebGPUProgram(d,[i,a,o],i.dtype,f)}const Zl={kernelName:jt,backendName:`webgpu`,kernelFunc:Xl},Ql=Q({opType:G.MAX,cpuKernelImpl:ra}),$l={kernelName:Fe,backendName:`webgpu`,kernelFunc:Ql}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
;
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function eu(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{filterSize:a,strides:o,pad:s,dimRoundingMode:c}=r;return lo(i,ue(i.shape,a,o,1,s,c),`max`,n)}const tu={kernelName:hn,backendName:`webgpu`,kernelFunc:eu};
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function nu(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{filterSize:a,strides:o,pad:s,dataFormat:c,dimRoundingMode:l}=r,u=pt(i.shape,a,o,[1,1,1],s,l,c),d=new io(u,`max`),f=[{type:`int32`,data:[u.strideDepth,u.strideHeight,u.strideWidth]},{type:`int32`,data:[u.padInfo.front,u.padInfo.top,u.padInfo.left]},{type:`int32`,data:[u.inDepth,u.inHeight,u.inWidth]},{type:`int32`,data:[u.effectiveFilterDepth,u.effectiveFilterHeight,u.effectiveFilterWidth]}];return n.runWebGPUProgram(d,[i],i.dtype,f)}const ru={kernelName:a,backendName:`webgpu`,kernelFunc:nu};
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var iu=class{constructor(e){this.variableNames=[`dy`,`maxPos`],this.uniforms=`strides : vec2<i32>, pads : vec2<i32>, dilations : vec2<i32>, filterDims : vec2<i32>,
       outHeight : i32, outWidth : i32`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e.inShape,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey=`maxPool2DBackprop`}getUserCode(){return`
      ${B(`index`)} {
      if (index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        let batch = coords[0];
        let d = coords[3];

        let dyRCCorner = vec2<i32>(coords.yz) - uniforms.pads;
        let dyRCorner = dyRCCorner.x;
        let dyCCorner = dyRCCorner.y;

        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).
        // ? = to be determined. : = across all values in that axis.
        var dotProd = 0.0;
        let lastIndex = uniforms.filterDims[0] * uniforms.filterDims[1] - 1;
        for (var wR = 0; wR < uniforms.filterDims[0]; wR += uniforms.dilations[0]) {
          let dyR = f32(dyRCorner + wR) / f32(uniforms.strides[0]);

          if (dyR < 0.0 || dyR >= f32(uniforms.outHeight) || fract(dyR) > 0.0) {
            continue;
          }
          let idyR = i32(dyR);

          for (var wC = 0; wC < uniforms.filterDims[1]; wC += uniforms.dilations[1]) {
            let dyC = f32(dyCCorner + wC) / f32(uniforms.strides[1]);

            if (dyC < 0.0 || dyC >= f32(uniforms.outWidth) || fract(dyC) > 0.0) {
              continue;
            }
            let idyC = i32(dyC);

            let dyValue = getDy(batch, idyR, idyC, d);
            let maxPosValue = lastIndex - i32(getMaxPos(batch, idyR, idyC, d));

            // Get the current value, check it against the value from the
            // position matrix.
            let curPosValue = wR * uniforms.filterDims[1] + wC;
            let mask = select(0.0, 1.0, maxPosValue == curPosValue);
            dotProd += dyValue * mask;
          }
        }
        setOutputAtIndex(index, dotProd);
      }
    }
    `}},au=class{constructor(e){this.variableNames=[`dy`,`maxPos`],this.uniforms=`strides : vec3<i32>, pads : vec3<i32>, filterDims : vec3<i32>,
      outDepth : i32, outHeight : i32, outWidth : i32`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e.inShape,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey=`maxPool3DBackprop`}getUserCode(){return`
      ${B(`index`)} {
      if (index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        let batch = coords.x;
        let ch = coords.u;

        let dyCorner = vec3<i32>(coords.y, coords.z, coords.w) - uniforms.pads;
        let dyDCorner = dyCorner.x;
        let dyRCorner = dyCorner.y;
        let dyCCorner = dyCorner.z;

        // Convolve dy(?, ?, ?, ch) with pos mask(:, :, :, d) to get
        // dx(xD, xR, xC, ch).
        // ? = to be determined. : = across all values in that axis.
        var dotProd = 0.0;
        let lastIndex = uniforms.filterDims[0] * uniforms.filterDims[1] * uniforms.filterDims[2] - 1;

        for (var wD = 0; wD < uniforms.filterDims[0]; wD++) {
          let dyD = f32(dyDCorner + wD) / f32(uniforms.strides[0]);

          if (dyD < 0.0 || dyD >= f32(uniforms.outDepth) || fract(dyD) > 0.0) {
            continue;
          }
          let idyD = i32(dyD);

          for (var wR = 0; wR < uniforms.filterDims[1]; wR++) {
            let dyR = f32(dyRCorner + wR) / f32(uniforms.strides[1]);

            if (dyR < 0.0 || dyR >= f32(uniforms.outHeight) || fract(dyR) > 0.0) {
              continue;
            }
            let idyR = i32(dyR);

            for (var wC = 0; wC < uniforms.filterDims[2]; wC++) {
              let dyC = f32(dyCCorner + wC) / f32(uniforms.strides[2]);

              if (dyC < 0.0 || dyC >= f32(uniforms.outWidth) || fract(dyC) > 0.0) {
                continue;
              }
              let idyC = i32(dyC);

              let dyValue = getDy(batch, idyD, idyR, idyC, ch);
              let maxPosValue = lastIndex - i32(getMaxPos(batch, idyD, idyR, idyC, ch));

              // Get the current value, check it against the value from the
              // position matrix.
              let curPosValue = wD * uniforms.filterDims[1] * uniforms.filterDims[2] + wR * uniforms.filterDims[2] + wC;
              let mask = select(0.0, 1.0, maxPosValue == curPosValue);
              dotProd += dyValue * mask;
            }
          }
        }

        setOutputAtIndex(index, dotProd);
      }
    }
    `}};
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ou(e){let{inputs:t,backend:n,attrs:r}=e,{dy:i,input:a}=t,o=a,{filterSize:s,strides:c,pad:l,dimRoundingMode:u}=r,d=pt(o.shape,s,c,[1,1,1],l,u),f=new io(d,`max`,!0),p=[{type:`int32`,data:[d.strideDepth,d.strideHeight,d.strideWidth]},{type:`int32`,data:[d.padInfo.front,d.padInfo.top,d.padInfo.left]},{type:`int32`,data:[d.inDepth,d.inHeight,d.inWidth]},{type:`int32`,data:[d.effectiveFilterDepth,d.effectiveFilterHeight,d.effectiveFilterWidth]}],m=n.runWebGPUProgram(f,[o],`int32`,p),h=new au(d);p=[{type:`int32`,data:[d.strideDepth,d.strideHeight,d.strideWidth]},{type:`int32`,data:[d.effectiveFilterDepth-1-d.padInfo.front,d.effectiveFilterHeight-1-d.padInfo.top,d.effectiveFilterWidth-1-d.padInfo.left]},{type:`int32`,data:[d.effectiveFilterDepth,d.effectiveFilterHeight,d.effectiveFilterWidth]},{type:`int32`,data:[d.outDepth]},{type:`int32`,data:[d.outHeight]},{type:`int32`,data:[d.outWidth]}];let g=n.runWebGPUProgram(h,[i,m],o.dtype,p);return n.disposeData(m.dataId),g}const su={kernelName:dn,backendName:`webgpu`,kernelFunc:ou};
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function cu(e){let{inputs:t,backend:n,attrs:r}=e,{dy:i,input:a,output:o}=t,s=a;ni([a,o],`maxPoolGrad`);let{filterSize:c,strides:l,pad:u,dimRoundingMode:d}=r,f=ue(s.shape,c,l,1,u,d),p=new ro(f,`max`,!0),m=[{type:`int32`,data:[f.strideHeight,f.strideWidth]},{type:`int32`,data:[f.padInfo.top,f.padInfo.left]},{type:`int32`,data:[f.dilationHeight,f.dilationWidth]},{type:`int32`,data:[f.inHeight,f.inWidth]},{type:`int32`,data:[f.effectiveFilterHeight,f.effectiveFilterWidth]}],h=n.runWebGPUProgram(p,[s],`int32`,m),g=new iu(f);m=[{type:`int32`,data:[f.strideHeight,f.strideWidth]},{type:`int32`,data:[f.effectiveFilterHeight-1-f.padInfo.top,f.effectiveFilterWidth-1-f.padInfo.left]},{type:`int32`,data:[f.dilationHeight,f.dilationWidth]},{type:`int32`,data:[f.effectiveFilterHeight,f.effectiveFilterWidth]},{type:`int32`,data:[f.outHeight]},{type:`int32`,data:[f.outWidth]}];let _=n.runWebGPUProgram(g,[i,h],s.dtype,m);return n.disposeData(h.dataId),_}const lu={kernelName:Ce,backendName:`webgpu`,kernelFunc:cu};
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function uu(e){let{inputs:t,backend:n,attrs:r}=e,{filterSize:i,strides:a,pad:o,includeBatchInIndex:s}=r,{x:c}=t;j(c.shape.length===4,()=>`Error in maxPool: input must be rank 4 but got rank ${c.shape.length}.`);let l=[1,1];j(_t(a,l),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${a} and dilations '${l}'`);let u=ue(c.shape,i,a,l,o),d=[{type:`int32`,data:[u.strideHeight,u.strideWidth]},{type:`int32`,data:[u.padInfo.top,u.padInfo.left]},{type:`int32`,data:[u.dilationHeight,u.dilationWidth]},{type:`int32`,data:[u.inHeight,u.inWidth]},{type:`int32`,data:[u.effectiveFilterHeight,u.effectiveFilterWidth]}],f=new ro(u,`max`,!1),p=n.runWebGPUProgram(f,[c],c.dtype,d);return f=new ro(u,`max`,!0,!0,s),[p,n.runWebGPUProgram(f,[c],`int32`,d)]}const du={kernelName:De,backendName:`webgpu`,kernelFunc:uu};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function fu(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{axis:a,keepDims:o}=r;return Ia(i,a,o,`min`,n)}const pu={kernelName:`Min`,backendName:`webgpu`,kernelFunc:fu},mu=Q({opType:G.MIN,cpuKernelImpl:ia}),hu={kernelName:se,backendName:`webgpu`,kernelFunc:mu}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
;
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var gu=class{constructor(e,t,n){this.uniforms=``,this.variableNames=[`x`],this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t.map((t,n)=>t[0]+e[n]+t[1]),this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.xShape=e,t.map((e,t)=>{this.uniforms+=` pad${t} : vec2<i32>,`}),this.offset=n===`reflect`?0:1,this.shaderKey=`mirrorPad_${n}`}getUserCode(){let e=this.xShape.length,t=this.xShape.map((e,t)=>`uniforms.pad${t}[0]`).join(`,`),n=this.xShape.map((t,n)=>`uniforms.pad${n}[0] + uniforms.xShape${e>1?`[${n}]`:``}`).join(`,`),r=e===1?`start`:`start[i]`,i=e===1?`end`:`end[i]`,a=e===1?`outC`:`outC[i]`,o=R(e),s=e>1?[`coords[0]`,`coords[1]`,`coords[2]`,`coords[3]`].slice(0,e):`coords`;return`
      ${B(`index`)} {
        if (index < uniforms.size) {
          let start = ${o}(${t});
          let end = ${o}(${n});
          var outC = getCoordsFromIndex(index);
          for (var i = 0; i < ${e}; i = i + 1) {
            if (${a} < ${r}) {
              ${a} = ${r} * 2 - ${a} - ${this.offset};
            } else if(${a} >= ${i}) {
              ${a} = (${i} - 1) * 2 - ${a} + ${this.offset};
            }
          }
          let coords = outC - start;
          setOutputAtIndex(index, getX(${s}));
        }
      }
    `}};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
const _u={kernelName:ye,backendName:`webgpu`,kernelFunc:({inputs:e,attrs:t,backend:n})=>{let{x:r}=e,{paddings:i,mode:a}=t,o=n,s=i.map(e=>({type:`int32`,data:[e[0],e[1]]})),c=new gu(r.shape,i,a);return o.runWebGPUProgram(c,[r],r.dtype,s)}},vu={kernelName:`Mod`,backendName:`webgpu`,kernelFunc:Q({opType:G.MOD})}
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
;
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var yu=class{constructor(e,t){this.variableNames=[`probs`],this.outputShape=[],this.uniforms=`seed : f32, numOutcomes: i32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=[e,t],this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey=`multinomial`}getUserCode(){return`
    //Based on the work of Dave Hoskins
    //https://www.shadertoy.com/view/4djSRW
    fn random (seed : f32, resultUV : vec2<f32>) -> f32 {
      let HASHSCALE1 = 443.8975;
      let p = resultUV * seed;
      var p3  = fract(vec3<f32>(p.xyx) * HASHSCALE1);
      p3 = p3 + dot(p3, p3.yzx + 19.19);
      return fract((p3.x + p3.y) * p3.z);
    }

    ${B(`index`)} {
      if (index < uniforms.size) {
        let coords = getOutputCoords();
        let batch = coords[0];

        let resUV = vec2<f32>(f32(coords[1]) / f32(uniforms.outShape[1]),
            f32(coords[0]) / f32(uniforms.outShape[0]));
        let r = random(uniforms.seed, resUV);
        var cdf = 0.0;
        for (var i = 0; i < uniforms.numOutcomes - 1; i = i + 1) {
          cdf = cdf + getProbs(batch, i);

          if (r < cdf) {
            setOutputAtIndexI32(index, i);
            return;
          }
        }

        // If no other event happened, last event happened.
        setOutputAtIndexI32(index, uniforms.numOutcomes - 1);
      }
    }
  `}},bu=class{constructor(e){
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
this.variableNames=[`logits`],this.outputShape=e,this.dispatchLayout=U(this.outputShape),this.dispatch=[this.outputShape[0],1,1],this.workgroupSize=this.outputShape[1]>=4096?[256,1,1]:[64,1,1],this.shaderKey=`softmax`}getUserCode(){return`
    var<workgroup> buf : array<f32, ${this.workgroupSize[0]}>;
    var<workgroup> rowMaxShared : f32;
    var<workgroup> rowSumShared : f32;
    const blockSize = ${this.workgroupSize[0]};
    ${B(`index`)} {
      let row = index / blockSize;
      let tid = i32(localId.x);
      let cols = uniforms.outShape[1];

      var threadMax = -3.402823e+38f;
      for (var col = tid; col < cols; col += blockSize) {
        let value = getLogits(row, col);
        threadMax = max(threadMax, value);
      }
      if (tid < cols) {
        buf[tid] = threadMax;
      }
      workgroupBarrier();

      var reduceSize = min(cols, blockSize);
      for (var currSize = reduceSize >> 1;  currSize > 0; currSize = reduceSize >> 1) {
        reduceSize = currSize + (reduceSize & 1);
        if (tid < currSize) {
          buf[tid] = max(buf[tid], buf[tid + reduceSize]);
        }
        workgroupBarrier();
      }

      if (tid == 0) {
        rowMaxShared = buf[0];
      }
      workgroupBarrier();

      var threadSum = 0.0;
      for (var col = tid; col < cols; col += blockSize) {
        let subExp = exp(getLogits(row, col) - rowMaxShared);
        threadSum += subExp;
      }
      buf[tid] = threadSum;
      workgroupBarrier();

      for (var currSize = blockSize >> 1;  currSize > 0; currSize = currSize >> 1) {
        if (tid < currSize) {
          buf[tid] = buf[tid] + buf[tid + currSize];
        }
        workgroupBarrier();
      }

      if (tid == 0) {
        rowSumShared = buf[0];
      }
      workgroupBarrier();

      for (var col = tid; col < cols; col += blockSize) {
        let value = exp(getLogits(row, col) - rowMaxShared) / rowSumShared;
        setOutputAtCoords(row, col, value);
      }
  }
    `}};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function xu(e){let{inputs:t,backend:n,attrs:r}=e,{logits:i}=t,{dim:a}=r,o=Y({inputs:{x:i},backend:n,attrs:{shape:[N(i.shape)/i.shape[a],i.shape[a]]}}),s=new bu(o.shape),c=n.runWebGPUProgram(s,[o],i.dtype),l=Y({inputs:{x:c},backend:n,attrs:{shape:i.shape}});return n.disposeData(o.dataId),n.disposeData(c.dataId),l}const Su={kernelName:sr,backendName:`webgpu`,kernelFunc:xu};
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Cu(e){let{inputs:t,backend:n,attrs:r}=e,{logits:i}=t,{numSamples:a,seed:o,normalized:s}=r,c=s?i:xu({inputs:{logits:i},backend:n,attrs:{dim:i.shape.length-1}}),l=c.shape[0],u=c.shape[1],d=new yu(l,a),f=[{type:`float32`,data:[o]},{type:`int32`,data:[u]}],p=n.runWebGPUProgram(d,[c],`int32`,f);return s||n.disposeData(c.dataId),p}const wu={kernelName:Ue,backendName:`webgpu`,kernelFunc:Cu};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Tu(e){let{inputs:t,backend:n}=e,{x:r}=t;if(n.shouldExecuteOnCPU([r])){let e=n.tensorMap.get(r.dataId),[t,i]=oa(e.values,r.shape,r.dtype);return n.makeTensorInfo(i,r.dtype,t)}let i=new zi(r.shape,K.NEG);return n.runWebGPUProgram(i,[r],r.dtype)}const Eu={kernelName:`Neg`,backendName:`webgpu`,kernelFunc:Tu};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Du(e){console.warn(`tf.nonMaxSuppression() in webgpu locks the UI thread. Call tf.nonMaxSuppressionAsync() instead`);let{inputs:t,backend:n,attrs:r}=e,{boxes:i,scores:a}=t,{maxOutputSize:o,iouThreshold:s,scoreThreshold:c}=r,l=n.readSync(i.dataId),u=n.readSync(a.dataId),{selectedIndices:d}=Ee(l,u,o,s,c);return n.makeTensorInfo([d.length],`int32`,new Int32Array(d))}const Ou={kernelName:l,backendName:`webgpu`,kernelFunc:Du};
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ku(e){console.warn(`tf.nonMaxSuppression() in webgpu locks the UI thread. Call tf.nonMaxSuppressionAsync() instead`);let{inputs:t,backend:n,attrs:r}=e,{boxes:i,scores:a}=t,{maxOutputSize:o,iouThreshold:s,scoreThreshold:c,softNmsSigma:l}=r,u=n.readSync(i.dataId),d=n.readSync(a.dataId),{selectedIndices:f,selectedScores:p}=Pe(u,d,o,s,c,l);return[n.makeTensorInfo([f.length],`int32`,new Int32Array(f)),n.makeTensorInfo([p.length],`float32`,new Float32Array(p))]}const Au={kernelName:rt,backendName:`webgpu`,kernelFunc:ku};
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var ju=class{constructor(e,t){this.variableNames=[`x`],this.uniforms=`onValue : f32, offValue : f32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=[e,t],this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey=`onehot`}getUserCode(){return`
      ${B(`index`)} {
        if(index < uniforms.size) {
          let coords = getCoordsFromIndex(index);
          setOutputAtIndex(index, mix(uniforms.offValue, uniforms.onValue,
                                      f32(i32(round(getX(coords.x))) == coords.y)));
        }
      }
    `}};
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Mu(e){let{inputs:t,backend:n,attrs:r}=e,{indices:i}=t,{dtype:a,depth:o,onValue:s,offValue:c}=r,l=N(i.shape),u=new ju(l,o),d=Y({inputs:{x:i},backend:n,attrs:{shape:[l]}}),f=[{type:`float32`,data:[s]},{type:`float32`,data:[c]}],p=n.runWebGPUProgram(u,[d],a,f);n.disposeData(d.dataId);let m=[...i.shape,o],h=Y({inputs:{x:p},backend:n,attrs:{shape:m}});return n.disposeData(p.dataId),h}const Nu={kernelName:et,backendName:`webgpu`,kernelFunc:Mu};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Pu(e){let{inputs:t,backend:n}=e,{x:r}=t;if(r.dtype===`complex64`){let e=Ro({inputs:{input:r},backend:n}),t=Pu({inputs:{x:e},backend:n}),i=es({inputs:{input:r},backend:n}),a=Pu({inputs:{x:i},backend:n}),o=Li({inputs:{real:t,imag:a},backend:n});return n.disposeData(e.dataId),n.disposeData(t.dataId),n.disposeData(i.dataId),n.disposeData(a.dataId),o}return J({attrs:{shape:r.shape,dtype:r.dtype,value:r.dtype===`string`?``:0},backend:n})}const Fu={kernelName:Cr,backendName:`webgpu`,kernelFunc:Pu};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Iu(e){let{inputs:t,backend:n}=e,{x:r}=t;if(r.dtype===`string`)throw Error(`onesLike is not supported under string dtype`);if(r.dtype===`complex64`){let e=Ro({inputs:{input:r},backend:n}),t=Iu({inputs:{x:e},backend:n}),i=es({inputs:{input:r},backend:n}),a=Pu({inputs:{x:i},backend:n}),o=Li({inputs:{real:t,imag:a},backend:n});return n.disposeData(e.dataId),n.disposeData(t.dataId),n.disposeData(i.dataId),n.disposeData(a.dataId),o}return J({attrs:{shape:r.shape,dtype:r.dtype,value:1},backend:n})}const Lu={kernelName:ot,backendName:`webgpu`,kernelFunc:Iu};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ru(e){let{inputs:t,backend:n,attrs:r}=e,{axis:i}=r;if(t.length===1)return Ic({inputs:{input:t[0]},backend:n,attrs:{dim:i}});let a=t[0].shape,o=t[0].dtype;t.forEach(e=>{st(a,e.shape,`All tensors passed to stack must have matching shapes`),j(o===e.dtype,()=>`All tensors passed to stack must have matching dtypes`)});let s=[],c=is({inputs:t.map(e=>{let t=Ic({inputs:{input:e},backend:n,attrs:{dim:i}});return s.push(t),t}),backend:n,attrs:{axis:i}});return s.forEach(e=>n.disposeData(e.dataId)),c}const zu={kernelName:O,backendName:`webgpu`,kernelFunc:Ru};
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Bu(e,t=!1){let n=e.length,r=R(n),i=e.map((e,t)=>`uniforms.pad${t}[0]`).join(`,`),a=e.map((e,t)=>`uniforms.pad${t}[0] + uniforms.xShape${n>1?`[${t}]`:``}`).join(`,`),o=n>1?`${r}(${i})`:`${i}`,s=n>1?`${r}(${a})`:`${a}`,c=n>1?`any(paddedCoords < start)`:`paddedCoords < start`,l=n>1?`any(paddedCoords >= end)`:`paddedCoords >= end`,u=n>1?[`coords[0]`,`coords[1]`,`coords[2]`,`coords[3]`].slice(0,n):`coords`;return`
        let start = ${o};
        let end = ${s};
        if (${c} || ${l}) {
          setOutputAtIndex(index, ${t?0:`uniforms.constantValue`});
        } else {
          let coords = paddedCoords - start;
          setOutputAtIndex(index, getX(${u}));
        }
  `}var Vu=class{constructor(e,t){this.variableNames=[`x`],this.uniforms=`constantValue : f32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t.map((t,n)=>t[0]+e[n]+t[1]),this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),t.map((e,t)=>{this.uniforms+=` pad${t} : vec2<i32>,`}),this.xShape=e,this.shaderKey=`pad`}getUserCode(){return`
      ${B(`index`)} {
        if (index < uniforms.size) {
          let paddedCoords = getCoordsFromIndex(index);
          ${Bu(this.xShape)}
        }
      }
    `}}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
;const Hu={kernelName:he,backendName:`webgpu`,kernelFunc:e=>{let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{paddings:a,constantValue:o}=r;if(a.every(e=>ie(e,[0,0])))return X({inputs:{x:i},backend:n});if(N(i.shape)===0)return J({backend:n,attrs:{shape:a.map((e,t)=>e[0]+i.shape[t]+e[1]),value:o,dtype:i.dtype}});let s=[{type:`float32`,data:[o]}];a.map(e=>s.push({type:`int32`,data:[e[0],e[1]]}));let c=new Vu(i.shape,a);return n.runWebGPUProgram(c,[i],i.dtype,s)}},Uu={kernelName:`Pow`,backendName:`webgpu`,kernelFunc:Q({opType:G.POW})}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
;
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Wu(e){let{inputs:t,backend:n}=e,{x:r,alpha:i}=t,a=new Fi(G.PRELU,r.shape,i.shape);return n.runWebGPUProgram(a,[r,i],`float32`)}const Gu={kernelName:zn,backendName:`webgpu`,kernelFunc:Wu};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Ku(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{axis:a,keepDims:o}=r;return Ia(i,a,o,`prod`,n)}const qu={kernelName:de,backendName:`webgpu`,kernelFunc:Ku},Ju={kernelName:mt,backendName:`webgpu`,kernelFunc:e=>{
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
let{backend:t,attrs:n}=e,{start:r,stop:i,step:a,dtype:o}=n,s=la(r,i,a,o);return t.makeTensorInfo([s.length],o,s)}},Yu=Q({opType:G.DIV}),Xu={kernelName:vt,backendName:`webgpu`,kernelFunc:Yu},Zu=Z({opType:K.RECIPROCAL}),Qu={kernelName:ze,backendName:`webgpu`,kernelFunc:Zu},$u=Z({opType:K.RELU}),ed={kernelName:t,backendName:`webgpu`,kernelFunc:$u},td=Z({opType:K.RELU6}),nd={kernelName:Wt,backendName:`webgpu`,kernelFunc:td}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2022 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
;
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var rd=class{constructor(e,t,n){this.variableNames=[`x`],this.uniforms=`adjustHeightWidth : vec2<f32>, halfPixelCenters : f32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=[e[0],t,n,e[3]],this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey=`resizeBilinear`}getUserCode(){return`
      ${B(`index`)} {
        if (index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
          let b = coords[0];
          let d = coords[3];
          let rc = coords.yz;

          let effectiveInSize = vec2<f32>(
            f32(uniforms.xShape.y) - uniforms.adjustHeightWidth[0],
            f32(uniforms.xShape.z) - uniforms.adjustHeightWidth[1]);

          let effectiveOutSize = vec2<f32>(
            f32(uniforms.outShape.y) - uniforms.adjustHeightWidth[0],
            f32(uniforms.outShape.z) - uniforms.adjustHeightWidth[1]);

          let effectiveInputOverOutputRatioRC =
              effectiveInSize / effectiveOutSize;

          // Fractional source index
          let sourceFracIndexRC =
            (vec2<f32>(rc) + vec2<f32>(uniforms.halfPixelCenters)) *
            effectiveInputOverOutputRatioRC - vec2<f32>(uniforms.halfPixelCenters);

          // Compute the four integer indices.
          let sourceFloorRC = vec2<i32>(sourceFracIndexRC);
          let sourceCeilRC = vec2<i32>(
            min(vec2<f32>(uniforms.xShape.yz) - vec2<f32>(1.0), ceil(sourceFracIndexRC)));

          let topLeft = getX(b, sourceFloorRC.x, sourceFloorRC.y, d);
          let bottomLeft = getX(b, sourceCeilRC.x, sourceFloorRC.y, d);
          let topRight = getX(b, sourceFloorRC.x, sourceCeilRC.y, d);
          let bottomRight = getX(b, sourceCeilRC.x, sourceCeilRC.y, d);

          let fracRC = sourceFracIndexRC - vec2<f32>(sourceFloorRC);

          let top = topLeft + (topRight - topLeft) * fracRC.y;
          let bottom = bottomLeft + (bottomRight - bottomLeft) * fracRC.y;
          let newValue = top + (bottom - top) * fracRC.x;

          setOutputAtIndex(index, newValue);
        }
      }
    `}};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function id(e){let{inputs:t,backend:n,attrs:r}=e,{images:i}=t,{alignCorners:a,size:o,halfPixelCenters:s}=r,[c,l]=o,u=[{type:`float32`,data:[a&&c>1?1:0,a&&l>1?1:0]},{type:`float32`,data:[s?.5:0]}],d=new rd(i.shape,c,l);return n.runWebGPUProgram(d,[i],`float32`,u)}const ad={kernelName:On,backendName:`webgpu`,kernelFunc:id};
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var od=class{constructor(e,t){this.variableNames=[`dy`],this.uniforms=`effectiveXSize : vec2<i32>, effectiveYSize : vec2<i32>, heightScale : f32, widthScale : f32,
       invHeightScale : f32, invWidthScale : f32, winHeight : i32, winWidth : i32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.alignCorners=t,this.shaderKey=`resizeBilinearBackprop_${t}`}getUserCode(){return`
      ${B(`index`)} {
        if (index < uniforms.size) {
          let coords = getOutputCoords();
          let b = coords[0];
          let d = coords[3];
          let r = coords[1];
          let c = coords[2];

          var accumulator = 0.0;

          // Compute bounds for where in dy we will look
          let startRLerp = floor(f32(r) * uniforms.invHeightScale);
          let startDyR = i32(startRLerp - f32(uniforms.winHeight / 2));

          let startCLerp = floor(f32(c) * uniforms.invWidthScale);
          let startDyC = i32(startCLerp - f32(uniforms.winWidth / 2));

          // Loop over dy
          for (var dyROffset = 0; dyROffset < uniforms.winHeight; dyROffset++) {
            let dyR = startDyR + dyROffset;

            // Guard against the window exceeding the bounds of dy
            if (dyR < 0 || dyR >= uniforms.dyShape[1]) {
              continue;
            }

            for (var dyCOffset = 0; dyCOffset < uniforms.winWidth; dyCOffset++) {
              let dyC = startDyC + dyCOffset;

              // Guard against the window exceeding the bounds of dy
              if (dyC < 0 || dyC >= uniforms.dyShape[2]) {
                continue;
              }

              let dxR = f32(dyR) * uniforms.heightScale;
              let topDxRIndex = i32(floor(dxR));
              let bottomDxRIndex = i32(min(ceil(dxR), f32(uniforms.outShape[1] - 1)));
              let dxRLerp = dxR - f32(topDxRIndex);
              let inverseDxRLerp = 1.0 - dxRLerp;

              let dxC = f32(dyC) * uniforms.widthScale;
              let leftDxCIndex = i32(floor(dxC));
              let rightDxCIndex = i32(min(ceil(dxC), f32(uniforms.outShape[2] - 1)));
              let dxCLerp = dxC - f32(leftDxCIndex);
              let inverseDxCLerp = 1.0 - dxCLerp;

              if (r == topDxRIndex && c == leftDxCIndex) {
                // topLeft
                accumulator +=
                  getDy(b, dyR, dyC, d) * inverseDxRLerp * inverseDxCLerp;
              }

              if (r == topDxRIndex && c == rightDxCIndex) {
                // topRight
                accumulator += getDy(b, dyR, dyC, d) * inverseDxRLerp * dxCLerp;
              }

              if (r == bottomDxRIndex && c == leftDxCIndex) {
                // bottomLeft
                accumulator += getDy(b, dyR, dyC, d) * dxRLerp * inverseDxCLerp;
              }

              if (r == bottomDxRIndex && c == rightDxCIndex) {
                // bottomRight
                accumulator += getDy(b, dyR, dyC, d) * dxRLerp * dxCLerp;
              }
            }
          }
          // End loop over dy

          setOutputAtIndex(index, accumulator);
        }
      }
    `}};
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function sd(e){let{inputs:t,backend:n,attrs:r}=e,{images:i,dy:a}=t,{alignCorners:o}=r,[,s,c]=i.shape,[,l,u]=a.shape,d=[o&&l>1?s-1:s,o&&u>1?c-1:c],f=[o&&l>1?l-1:l,o&&u>1?u-1:u],p=d[0]/f[0],m=d[1]/f[1],h=1/p,g=1/m,_=Math.ceil(h)*2+2,v=Math.ceil(g)*2+2,y=new od(i.shape,o),b=[{type:`int32`,data:d},{type:`int32`,data:f},{type:`float32`,data:[p]},{type:`float32`,data:[m]},{type:`float32`,data:[h]},{type:`float32`,data:[g]},{type:`int32`,data:[_]},{type:`int32`,data:[v]}];return n.runWebGPUProgram(y,[a],a.dtype,b)}const cd={kernelName:Gn,backendName:`webgpu`,kernelFunc:sd};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var ld=class{constructor(e,t,n,r){this.variableNames=[`x`],this.uniforms=`adjustHeightWidth : vec2<f32>, roundBase : f32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=[e[0],t,n,e[3]],this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.halfPixelCenters=r,this.shaderKey=`resizeNearest_${r}`}getUserCode(){let e;return e=this.halfPixelCenters?`max((vec2<f32>(rc) + vec2<f32>(0.5)) * effectiveInputOverOutputRatioRC, vec2<f32>(0.0))`:`vec2<f32>(rc) * effectiveInputOverOutputRatioRC`,`
      ${B(`index`)} {
        if (index < uniforms.size) {
          let coords = getCoordsFromIndex(index);
          let b = coords[0];
          let d = coords[3];
          let rc = coords.yz;

          let effectiveInSize = vec2<f32>(
            f32(uniforms.xShape.y) - uniforms.adjustHeightWidth[0],
            f32(uniforms.xShape.z) - uniforms.adjustHeightWidth[1]);

          let effectiveOutSize = vec2<f32>(
            f32(uniforms.outShape.y) - uniforms.adjustHeightWidth[0],
            f32(uniforms.outShape.z) - uniforms.adjustHeightWidth[1]);

          let effectiveInputOverOutputRatioRC =
              effectiveInSize / effectiveOutSize;

          // Fractional source index
          let sourceFracIndexRC = ${e};

          // Compute the coordinators of nearest neighbor point.
          let inputShapeRC = vec2<f32>(f32(uniforms.xShape.y), f32(uniforms.xShape.z));
          let sourceNearestRC = vec2<i32>(
            min(inputShapeRC - 1.0, floor(sourceFracIndexRC + uniforms.roundBase)));
          let newValue = getX(b, sourceNearestRC.x, sourceNearestRC.y, d);

          setOutputAtIndex(index, newValue);
        }
      }
    `}};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function ud(e){let{inputs:t,backend:n,attrs:r}=e,{images:i}=t,{alignCorners:a,halfPixelCenters:o,size:s}=r,[c,l]=s,u=[{type:`float32`,data:[a&&c>1?1:0,a&&l>1?1:0]},{type:`float32`,data:[a?.5:0]}],d=new ld(i.shape,c,l,o);return n.runWebGPUProgram(d,[i],i.dtype,u)}const dd={kernelName:cn,backendName:`webgpu`,kernelFunc:ud};
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var fd=class{constructor(e,t){this.variableNames=[`dy`],this.uniforms=`effectiveXSize : vec2<i32>, effectiveYSize : vec2<i32>, invHeightScale : f32, invWidthScale : f32,
       winHeight : i32, winWidth : i32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.alignCorners=t,this.shaderKey=`resizeNearestNeigborBackprop_${t}`}getUserCode(){return`
      ${B(`index`)} {
        if (index < uniforms.size) {
          let coords = getOutputCoords();
          let b = coords[0];
          let d = coords[3];
          let r = coords[1];
          let c = coords[2];

          var accumulator = 0.0;

          // Compute bounds for where in dy we will look
          let startRLerp = floor(f32(r) * uniforms.invHeightScale);
          let startDyR = i32(floor(startRLerp - f32(uniforms.winHeight / 2)));

          let startCLerp = floor(f32(c) * uniforms.invWidthScale);
          let startDyC = i32(floor(startCLerp - f32(uniforms.winWidth / 2)));

          // Loop over dy
          for (var dyROffset = 0; dyROffset < uniforms.winHeight; dyROffset++) {
            let dyR = startDyR + dyROffset;

            // Guard against the window exceeding the bounds of dy
            if (dyR < 0 || dyR >= uniforms.dyShape[1]) {
              continue;
            }

            for (var dyCOffset = 0; dyCOffset < uniforms.winWidth; dyCOffset++) {
              let dyC = startDyC + dyCOffset;

              // Guard against the window exceeding the bounds of dy
              if (dyC < 0 || dyC >= uniforms.dyShape[2]) {
                continue;
              }

              let sourceFracRow = f32(uniforms.effectiveXSize[0]) *
                  (f32(dyR) / f32(uniforms.effectiveYSize[0]));

              let sourceFracCol = f32(uniforms.effectiveXSize[1]) *
                  (f32(dyC) / f32(uniforms.effectiveYSize[1]));

              let sourceNearestRow =
                  i32(min(f32(uniforms.outShape[1] - 1),
                  ${this.alignCorners?`floor(sourceFracRow + 0.5)`:`floor(sourceFracRow)`}));

              let sourceNearestCol =
                  i32(min(f32(uniforms.outShape[2] - 1),
                  ${this.alignCorners?`floor(sourceFracCol + 0.5)`:`floor(sourceFracCol)`}));

              if (r == sourceNearestRow && c == sourceNearestCol) {
                accumulator += getDy(b, dyR, dyC, d);
              }
            }
          }
          // End loop over dy

          setOutputAtIndex(index, accumulator);
        }
      }
    `}};
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function pd(e){let{inputs:t,backend:n,attrs:r}=e,{images:i,dy:a}=t,{alignCorners:o}=r,[,s,c]=i.shape,[,l,u]=a.shape,d=[o&&l>1?s-1:s,o&&u>1?c-1:c],f=[o&&l>1?l-1:l,o&&u>1?u-1:u],p=d[0]/f[0],m=d[1]/f[1],h=1/p,g=1/m,_=Math.ceil(h)*2+2,v=Math.ceil(g)*2+2,y=new fd(i.shape,o),b=[{type:`int32`,data:d},{type:`int32`,data:f},{type:`float32`,data:[h]},{type:`float32`,data:[g]},{type:`int32`,data:[_]},{type:`int32`,data:[v]}];return n.runWebGPUProgram(y,[a],a.dtype,b)}const md={kernelName:Ot,backendName:`webgpu`,kernelFunc:pd};
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var hd=class{constructor(e){this.variableNames=[`x`],this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.uniforms=` axis : vec4<i32>,`,this.shaderKey=`reverse`}getUserCode(){return`
      
      // Using uniform variables as judging conditions, so the function has
      // coherent execution within all threads.
      fn getReverseCoords(coords : vec4<i32>) -> vec4<i32> {
        var reverseCoords = coords;
        if (uniforms.axis[0] == 1) {
          reverseCoords[0] = uniforms.xShape[0] - coords[0] - 1;
        }
        if (uniforms.axis[1] == 1) {
          reverseCoords[1] = uniforms.xShape[1] - coords[1] - 1;
        }
        if (uniforms.axis[2] == 1) {
          reverseCoords[2] = uniforms.xShape[2] - coords[2] - 1;
        }
        if (uniforms.axis[3] == 1) {
          reverseCoords[3] = uniforms.xShape[3] - coords[3] - 1;
        }

        return reverseCoords;
      }
    
      ${B(`index`)} {
        if (index < uniforms.size) {
          let coords = getCoordsFromIndex(index);
          let reverseCoords = getReverseCoords(coords);
          setOutputAtIndex(index, getX(reverseCoords[0],
              reverseCoords[1], reverseCoords[2], reverseCoords[3]));
        }
      }
    `}};
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function gd(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{dims:a}=r,o=i.shape.length;if(o===0)return X({inputs:{x:i},backend:n});let s=i.shape,c=[1,1,1,1];s.forEach((e,t)=>{let n=t+4-o;c[n]=e});let l=P(a,i.shape),u=[0,0,0,0];l.forEach(e=>{let t=e+4-o;u[t]=1});let d=[{type:`int32`,data:u}],f=Y({inputs:{x:i},backend:n,attrs:{shape:c}}),p=new hd(c),m=n.runWebGPUProgram(p,[f],f.dtype,d);n.disposeData(f.dataId);let h=Y({inputs:{x:m},backend:n,attrs:{shape:s}});return n.disposeData(m.dataId),h}const _d={kernelName:Mn,backendName:`webgpu`,kernelFunc:gd};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var vd=class{constructor(e,t){this.outputShape=[],this.variableNames=[`x`],this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.uniforms=`centerX : f32, centerY : f32, sinRadians : f32,
          cosRadians : f32,`,this.shaderKey=`rotate`,this.outputShape=e,typeof t==`number`?(this.uniforms+=` fillValue : f32,`,this.fillSnippet=`var outputValue = uniforms.fillValue;`,this.shaderKey+=`_float`):(this.uniforms+=` fillValue : vec3<f32>,`,this.fillSnippet=`var outputValue = uniforms.fillValue[coords[3]];`,this.shaderKey+=`_vec3`)}getUserCode(){return`
        ${B(`index`)} {
          if (index < uniforms.size) {
            let coords = getCoordsFromIndex(index);
            let coordXFloat = (f32(coords[2]) - uniforms.centerX) *
                uniforms.cosRadians - (f32(coords[1]) - uniforms.centerY) *
                uniforms.sinRadians;
            let coordYFloat = (f32(coords[2]) - uniforms.centerX) *
                uniforms.sinRadians + (f32(coords[1]) - uniforms.centerY) *
                uniforms.cosRadians;
            let coordX = i32(round(coordXFloat + uniforms.centerX));
            let coordY = i32(round(coordYFloat + uniforms.centerY));
            ${this.fillSnippet}
            if(coordX >= 0 && coordX < uniforms.xShape[2] && coordY >= 0 &&
                coordY < uniforms.xShape[1]) {
              outputValue = getX(coords[0], coordY, coordX, coords[3]);
            }
            setOutputAtIndex(index, outputValue);
          }
        }
      `}};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
const yd={kernelName:Yn,backendName:`webgpu`,kernelFunc:({inputs:e,attrs:t,backend:n})=>{let{image:r}=e,{radians:i,fillValue:a,center:o}=t,s=n,c=new vd(r.shape,a),[l,u]=Xe(o,r.shape[1],r.shape[2]),d=[{type:`float32`,data:[l]},{type:`float32`,data:[u]},{type:`float32`,data:[Math.sin(i)]},{type:`float32`,data:[Math.cos(i)]}];return typeof a==`number`?d.push({type:`float32`,data:[Number.parseFloat(a.toFixed(2))]}):d.push({type:`float32`,data:a}),s.runWebGPUProgram(c,[r],r.dtype,d)}},bd=Z({opType:K.ROUND}),xd={kernelName:It,backendName:`webgpu`,kernelFunc:bd},Sd=Z({opType:K.RSQRT,cpuKernelImpl:ua}),Cd={kernelName:bn,backendName:`webgpu`,kernelFunc:Sd}
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
;
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var wd=class{constructor(e,t,n,r,i,a,o,s=!0){this.variableNames=[`updates`,`indices`],this.workgroupSize=[64,1,1],this.atomic=!0,this.outputShape=a,this.type=o,this.sumDupeIndices=s,this.dispatchLayout=U(e),this.dispatch=H(this.dispatchLayout,e,this.workgroupSize),this.sliceDimGreaterThanOne=t>1,this.shaderKey=`scatter_${n}_${r}_${this.sliceDimGreaterThanOne}_${o}_${s}_${i.length}`;let c=R(i.length);this.uniforms=`sliceDim : i32, strides: ${c}, updatesSize: i32,`,this.updatesRank=r,this.indicesRank=n}getUserCode(){let e=``;this.indicesRank===1?e=`coords[0]`:this.indicesRank===2&&(e=`coords[0], j`);let t=`getIndices(${e})`,n=this.sliceDimGreaterThanOne?`uniforms.strides[j]`:`uniforms.strides`,r=``,i=``;this.dispatchLayout.x.length===1?(r=`flattenedIndex`,i=`
      fn getUpdatesCoordsFromFlatIndex(index : i32) -> i32 {
        return index;
      }
      `):this.dispatchLayout.x.length===2&&(r=`vec2<i32>(flattenedIndex, coords[1])`,i=`
      fn getUpdatesCoordsFromFlatIndex(index : i32) -> vec2<i32> {
        // N.B. |updates| could be a scalar tensor, conceptually representing a
        // 2D tensor with all values equal to that. By design, its size must be
        // the same as |outShape[1]| in one dimension, and |indicesShape[0]|
        // gives the other.
        let sliceSize = uniforms.outShape[1];
        let d0 = index / sliceSize;
        let d1 = index - d0 * sliceSize;
        return vec2<i32>(d0, d1);
      }
      `);let a=`getUpdates(${Array.from({length:this.updatesRank},(e,t)=>`coords[${t}]`).join(`, `)})`;return`
    ${i}
      ${B(`index`)} {
        if (index < uniforms.updatesSize) {
          let coords = getUpdatesCoordsFromFlatIndex(index);
          var flattenedIndex = 0;
          for (var j = 0; j < uniforms.sliceDim; j = j + 1) {
            let indexInside = i32(round(${t}));
            flattenedIndex = flattenedIndex + indexInside * ${n};
          }
          let updateValue =
              ${V(this.type)}(${a});
          let flatIndex = getOutputIndexFromCoords(${r});

          ${this.sumDupeIndices?I(`&result[flatIndex]`,`updateValue`,this.type):`atomicStore(&result[flatIndex], bitcast<i32>(updateValue));`}
        }
      }`}};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Td(e){let{inputs:t,backend:n,attrs:r}=e,{indices:i,updates:a}=t,{shape:o}=r,{sliceRank:s,numUpdates:c,sliceSize:l,strides:u,outputSize:d}=w(a,i,o),f=[d/l,l];if(d===0)return n.makeTensorInfo(o,i.dtype);let p=Y({inputs:{x:i},backend:n,attrs:{shape:[c,s]}}),m=Y({inputs:{x:a},backend:n,attrs:{shape:[c,l]}}),h=m.dtype,g=J({backend:n,attrs:{shape:f,value:0,dtype:h}}),_=N(m.shape),v=[{type:`int32`,data:[s]},{type:`int32`,data:u},{type:`int32`,data:[_]}],y=new wd(m.shape,s,p.shape.length,m.shape.length,u,f,h),b=n.runWebGPUProgram(y,[m,p],h,v,g),x=Y({inputs:{x:b},backend:n,attrs:{shape:o}});return n.disposeData(p.dataId),n.disposeData(m.dataId),n.disposeData(b.dataId),x}const Ed={kernelName:rr,backendName:`webgpu`,kernelFunc:Td};
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Dd=class{constructor(e,t){this.outputShape=[],this.variableNames=[`sortedSequence`,`values`],this.uniforms=`numInputs : i32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.side=t,this.shaderKey=`search_sorted_${t}`}getUserCode(){return`
      fn findBound(batch: i32, value: f32) -> i32 {
        var left = i32(0);
        var right = uniforms.numInputs;
        while (left < right) {
          var mid = (left + right) / 2;
          if (getSortedSequence(batch, mid) ${this.side===`left`?`<`:`<=`} value) {
            left = mid + 1;
          } else {
            right = mid;
          }
        }
        return right;
      }

      ${B(`index`)} {
        if (index < uniforms.size) {
          let coords = getCoordsFromIndex(index);
          let value = getValuesByOutputIndex(index);
          setOutputAtIndexI32(index, findBound(coords[0], value));
        }
      }
    `}};
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Od(e){let{inputs:t,backend:n,attrs:r}=e,{sortedSequence:i,values:a}=t,{side:o}=r,s=new Dd([a.shape[0],a.shape[1]],o),c=[{type:`int32`,data:[i.shape[1]]}];return n.runWebGPUProgram(s,[i,a],`int32`,c)}const kd={kernelName:Bt,backendName:`webgpu`,kernelFunc:Od};
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Ad=class{constructor(e,t,n){this.variableNames=[`c`,`a`,`b`],this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.cRank=e,this.rank=n,this.shaderKey=`select`}getUserCode(){let e,t;if(this.rank>4)throw Error(`Where for rank ${this.rank} is not yet supported`);if(this.rank===1)t=`resRC`,e=`resRC`;else{let n=[`resRC.x`,`resRC.y`,`resRC.z`,`resRC.w`],r=[],i=[];for(let e=0;e<this.outputShape.length;e++)i.push(`${n[e]}`),e<this.cRank&&r.push(`${n[e]}`);e=r.join(),t=i.join()}return`
      ${B(`index`)} {
        if (index < uniforms.size) {
          let resRC = getCoordsFromIndex(index);
          let cVal = getC(${e});
          if (cVal >= 1.0) {
            setOutputAtIndex(index, getA(${t}));
          } else {
            setOutputAtIndex(index, getB(${t}));
          }
        }
      }
    `}};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function jd(e){let{inputs:t,backend:n}=e,{condition:r,t:i,e:a}=t,o=new Ad(r.shape.length,i.shape,i.shape.length);return n.runWebGPUProgram(o,[r,i,a],kn(i.dtype,a.dtype))}const Md={kernelName:Jt,backendName:`webgpu`,kernelFunc:jd},Nd=Z({opType:K.SELU}),Pd={kernelName:In,backendName:`webgpu`,kernelFunc:Nd},Fd=Z({opType:K.SIGMOID}),Id={kernelName:wn,backendName:`webgpu`,kernelFunc:Fd},Ld=Z({opType:K.SIGN}),Rd={kernelName:nn,backendName:`webgpu`,kernelFunc:Ld},zd={kernelName:`Sin`,backendName:`webgpu`,kernelFunc:Z({opType:K.SIN})},Bd=Z({opType:K.SINH}),Vd={kernelName:Qt,backendName:`webgpu`,kernelFunc:Bd},Hd=Z({opType:K.SOFTPLUS}),Ud={kernelName:yr,backendName:`webgpu`,kernelFunc:Hd}
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
;
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Wd=class{constructor(e,t,n,r,i,a){this.variableNames=[`x`],this.outputShape=[],this.uniforms=``,this.workgroupSize=[64,1,1],this.size=!0;let o=Array(r.length);for(let e=0;e<o.length;e++)o[e]=r[i[e]];this.outputShape=o,this.newDim=i,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.xShape=e,this.paddedXShape=t,this.uniforms+=`reshapedPaddedXShape : ${R(r.length)}, paddedXShapeStrides : ${R(a)}, `,n.map((e,t)=>{this.uniforms+=` pad${t} : vec2<i32>,`}),this.shaderKey=`spaceToBatchND_${i}`}getUserCode(){let e=R(this.outputShape.length),t=Ma(this.newDim);return`
      ${Br(this.paddedXShape,`PaddedX`)}
      ${B(`index`)} {
        if(index < uniforms.size) {
          let coords = getCoordsFromIndex(index);
          let switchedIndex = getIndexFromCoords${this.outputShape.length}D(${e}(${t}), uniforms.reshapedPaddedXShape);
          let paddedCoords = getPaddedXCoordsFromIndex(switchedIndex);
          ${Bu(this.xShape,!0)}
        }
      }
    `}}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
;const Gd={kernelName:Mt,backendName:`webgpu`,kernelFunc:e=>{let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{blockShape:a,paddings:o}=r;j(i.shape.length<=4,()=>`spaceToBatchND for rank > 4 with a WebGPU backend not implemented yet`);let s=a.reduce((e,t)=>e*t),c=[[0,0]];c.push(...o);for(let e=1+a.length;e<i.shape.length;++e)c.push([0,0]);let l=c.map((e,t)=>e[0]+i.shape[t]+e[1]),u=pr(l,a,s,!1),d=At(u.length,a.length,!1),f=Ke(l,a,s,!1),p=k(l),m=new Wd(i.shape,l,c,u,d,p.length),h=[{type:`int32`,data:u},{type:`int32`,data:p}];c.map(e=>h.push({type:`int32`,data:[e[0],e[1]]}));let g=n.runWebGPUProgram(m,[i],i.dtype,h),_=Y({inputs:{x:g},backend:n,attrs:{shape:f}});return n.disposeData(g.dataId),_}};
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Kd=class{constructor(e,t,n){this.variableNames=[`input`,`indices`,`segmentIds`],this.outputShape=[],this.uniforms=`segmentSize : i32, sparseSize : i32,`,this.workgroupSize=[64,1,1],this.atomic=!0,this.outputShape=e,this.type=n,this.dispatchLayout=U([t]),this.dispatch=H(this.dispatchLayout,[t],this.workgroupSize),this.shaderKey=`sparseSegmentSum`}getUserCode(){return`
    ${B(`index`)} {
      if (index < uniforms.sparseSize) {
        let indexInSegmentIds = index / uniforms.segmentSize;
        let indexInSegment = index % uniforms.segmentSize;
        let indexInInput = indices[indexInSegmentIds];
        let segmentId = segmentIds[indexInSegmentIds];

        let value = input[indexInInput * uniforms.segmentSize + indexInSegment];
        let outIndex = segmentId * uniforms.segmentSize + indexInSegment;
        ${I(`&result[outIndex]`,`value`,this.type)}
      }
    }
  `}},qd=class{constructor(e,t){this.variableNames=[`segmentIds`],this.outputShape=[],this.workgroupSize=[64,1,1],this.atomic=!0,this.outputShape=[e],this.dispatchLayout=U(t),this.dispatch=H(this.dispatchLayout,t,this.workgroupSize),this.shaderKey=`sparseSegmentIdCountProgram`}getUserCode(){return`
    ${B(`index`)} {
      if (index < uniforms.segmentIdsShape) {
        let segmentId = segmentIds[index];
        ${I(`&result[segmentId]`,`1`,`int32`)}
      }
    }
  `}},Jd=class{constructor(e,t){this.variableNames=[`segmentSum`,`sameSegmentIdCount`],this.outputShape=[],this.uniforms=`segmentSize : i32`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.type=t,this.dispatchLayout=U(e),this.dispatch=H(this.dispatchLayout,e,this.workgroupSize),this.shaderKey=`sparseSegmentMean`}getUserCode(){return`
    ${B(`index`)} {
      if (index < uniforms.size) {
        let segmentId = index / uniforms.segmentSize;
        let count = sameSegmentIdCount[segmentId];
        if (count != 0) {
          ${this.type===`float32`?`setOutputAtIndex(index, segmentSum[index] / f32(count));`:`setOutputAtIndexI32(index, segmentSum[index] / count);`}
        }
      }
    }
  `}};
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Yd(e,t,n,r=!1,i){let a=N(e.shape)/e.shape[0],o=e.dtype,s=N(t.shape),c=i.readSync(n.dataId),l=s>0?c[s-1]+1:0,u,d=e.shape.slice();d[0]=l;let f=s*a,p=J({backend:i,attrs:{shape:d,value:0,dtype:o}});u=new Kd(d,f,o);let m=[{type:`int32`,data:[a]},{type:`int32`,data:[f]}],h=i.runWebGPUProgram(u,[e,t,n],o,m,p);if(r)return h;let g=J({backend:i,attrs:{shape:[l],value:0,dtype:`int32`}});u=new qd(l,n.shape);let _=i.runWebGPUProgram(u,[n],`int32`,null,g),v=J({backend:i,attrs:{shape:d,value:0,dtype:o}});u=new Jd(d,o),m=[{type:`int32`,data:[a]}];let y=i.runWebGPUProgram(u,[h,_],o,m,v);return i.disposeData(h.dataId),i.disposeData(_.dataId),y}
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Xd(e){let{inputs:t,backend:n}=e,{data:r,indices:i,segmentIds:a}=t;return Yd(r,i,a,!1,n)}const Zd={kernelName:hr,backendName:`webgpu`,kernelFunc:Xd};
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Qd(e){let{inputs:t,backend:n}=e,{data:r,indices:i,segmentIds:a}=t;return Yd(r,i,a,!0,n)}const $d={kernelName:Je,backendName:`webgpu`,kernelFunc:Qd};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var ef=class{constructor(e,t){this.variableNames=[`A`],this.workgroupSize=[64,1,1],this.size=!0;let n=Array(e.length);for(let r=0;r<n.length;r++)n[r]=e[r]*t[r];this.outputShape=n,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.rank=this.outputShape.length,this.shaderKey=`tile`}getUserCode(){let e=tf(this.rank,`uniforms.`);return`
      ${B(`index`)} {
        if (index < uniforms.size) {
          let resRC = getCoordsFromIndex(index);
          setOutputAtIndex(index, getA(${e}));
        }
      }
    `}};function tf(e,t=``){if(e>=5)throw Error(`Tile for rank ${e} is not yet supported`);if(e===1)return`(resRC % ${t}aShape)`;let n=[`resRC.x`,`resRC.y`,`resRC.z`,`resRC.w`],r=[];for(let i=0;i<e;i++)r.push(`(${n[i]} % ${t}aShape[${i}])`);return r.join()}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function nf(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{reps:a}=r;if(n.shouldExecuteOnCPU([i])||i.dtype===`string`||i.shape.length>=5){let e=n.readSync(i.dataId),t=i.dtype===`string`?e.map(e=>Kn(e)):e,r=Re(i.shape,i.dtype,t),o=_a(r,a);return n.makeTensorInfo(o.shape,o.dtype,o.values)}let o=new ef(i.shape,a);return n.runWebGPUProgram(o,[i],i.dtype)}const rf={kernelName:Oe,backendName:`webgpu`,kernelFunc:nf};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function af(e){let{inputs:t,backend:n,attrs:r}=e,{sparseIndices:i,sparseValues:a,defaultValue:o}=t,{outputShape:s}=r,{sliceRank:c,numUpdates:l,sliceSize:u,strides:d,outputSize:f}=w(a,i,s);if(a.dtype===`string`){let e=n.bufferSync(i),t=n.bufferSync(a),r=Kn(n.readSync(o.dataId)[0]),p=da(e,t,s,f,u,l,c,d,r,!1);return n.makeTensorInfo(s,p.dtype,p.values)}let p=[f/u,u],m=Y({inputs:{x:i},backend:n,attrs:{shape:[l,c]}}),h=a.shape.length?Y({inputs:{x:a},backend:n,attrs:{shape:[l,u]}}):X({inputs:{x:a},backend:n}),g=h.dtype,_=n.makeTensorInfo([],g,Ht(1,g)),v=Y({inputs:{x:o},backend:n,attrs:{shape:Array(p.length).fill(1)}}),y=nf({inputs:{x:v},backend:n,attrs:{reps:p}}),b=N([l,u]),x=[{type:`int32`,data:[c]},{type:`int32`,data:d},{type:`int32`,data:[b]}];switch(l){case 0:break;case 1:{let e=new wd([l,u],c,m.shape.length,h.shape.length,d,p,g,!1);n.runWebGPUProgram(e,[h,m],g,x,y)}break;default:{let e=new wd([l,u],c,m.shape.length,_.shape.length,d,p,g,!1);n.runWebGPUProgram(e,[_,m],g,x,y)}{let e=new wd([l,u],c,m.shape.length,h.shape.length,d,p,g);n.runWebGPUProgram(e,[h,m],g,x,y)}}let S=Y({inputs:{x:y},backend:n,attrs:{shape:s}});return n.disposeData(m.dataId),n.disposeData(h.dataId),n.disposeData(v.dataId),n.disposeData(_.dataId),n.disposeData(y.dataId),S}const of={kernelName:m,backendName:`webgpu`,kernelFunc:af};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function sf(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{numOrSizeSplits:a,axis:o}=r,s=P(o,i.shape)[0],c=Tt(i,a,s),l=i.shape.length,u=Array(l).fill(0),d=i.shape.slice();return c.map(e=>{let t=[...d];t[s]=e;let r=Eo({inputs:{x:i},backend:n,attrs:{begin:u,size:t}});return u[s]+=e,r})}const cf={kernelName:dr,backendName:`webgpu`,kernelFunc:sf},lf=Z({opType:K.SQRT}),uf={kernelName:Qe,backendName:`webgpu`,kernelFunc:lf},df={kernelName:S,backendName:`webgpu`,kernelFunc:({inputs:e,backend:t})=>{
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
let{x:n}=e,r=t,i=new zi(n.shape,K.SQUARE);return r.runWebGPUProgram(i,[n],n.dtype)}},ff=Q({opType:G.SQUARED_DIFFERENCE}),pf={kernelName:v,backendName:`webgpu`,kernelFunc:ff}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
;
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function mf({inputs:e,attrs:t,backend:n}){let{x:r}=e,i=new zi(r.shape,K.STEP,`stepAlpha : f32,`),a=[{type:`float32`,data:[t.alpha]}];return n.runWebGPUProgram(i,[r],r.dtype,a)}const hf={kernelName:Me,backendName:`webgpu`,kernelFunc:mf};
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var gf=class{constructor(e){this.variableNames=[`x`],this.workPerThread=1,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize,[this.workPerThread,1,1]);let t=R(this.outputShape.length);this.uniforms=`begin : ${t},  strides : ${t}, `,this.shaderKey=`stridedSlice`}getUserCode(){let e=this.outputShape.length,t=``;if(e===1)t=`coords * uniforms.strides + uniforms.begin`;else{let e=0;t=this.outputShape.map((t,n)=>(e++,this.outputShape.length===1?`coords * uniforms.strides[${n}] + uniforms.begin[${n}]`:`coords[${e-1}] * uniforms.strides[${n}] + uniforms.begin[${n}]`)).join(`,`)}return`
       ${B(`index`)} {
         if (index < uniforms.size) {
           let coords = getCoordsFromIndex(index);
           setOutputAtIndex(index, getX(${t}));
         }
       }
     `}};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function _f(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{begin:a,end:o,strides:s,beginMask:c,endMask:l,ellipsisMask:u,newAxisMask:d,shrinkAxisMask:f}=r,{finalShapeSparse:p,finalShape:m,isIdentity:h,sliceDim0:g,isSimpleSlice:_,begin:v,end:y,strides:b}=un(i.shape,a,o,s,c,l,u,d,f),x;if(h)x=Y({inputs:{x:i},backend:n,attrs:{shape:m}});else if(g||_){j(i.shape.length>=1,()=>`Input must have rank at least 1, got: ${i.shape.length}`);let e=mn(v,y,b),t=Eo({inputs:{x:i},backend:n,attrs:{begin:v,size:e}});x=Y({inputs:{x:t},backend:n,attrs:{shape:m}}),n.disposeData(t.dataId)}else if(n.shouldExecuteOnCPU([i])){let e=n.readSync(i.dataId),t=Re(i.shape,i.dtype,e),r=ma(p,t,b,v);x=n.makeTensorInfo(m,i.dtype,r.values)}else{let e=new gf(p),t=[{type:`int32`,data:v},{type:`int32`,data:b}],r=n.runWebGPUProgram(e,[i],i.dtype,t);x=Y({inputs:{x:r},backend:n,attrs:{shape:m}}),n.disposeData(r.dataId)}return x}const vf={kernelName:gn,backendName:`webgpu`,kernelFunc:_f};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function yf(e){let{inputs:t,backend:n,attrs:r}=e,{separator:i,nGramWidths:a,leftPad:o,rightPad:s,padWidth:c,preserveShortSequences:l}=r,{data:u,dataSplits:d}=t,f=n.readSync(u.dataId),p=n.readSync(d.dataId),[m,h]=ha(f,p,i,a,o,s,c,l);return[n.makeTensorInfo([m.length],`string`,m),n.makeTensorInfo(d.shape,`int32`,h)]}const bf={kernelName:o,backendName:`webgpu`,kernelFunc:yf},xf={kernelName:`Sub`,backendName:`webgpu`,kernelFunc:Q({opType:G.SUB,cpuKernelImpl:ga,supportsComplex:!0})},Sf={kernelName:`Tan`,backendName:`webgpu`,kernelFunc:Z({opType:K.TAN})},Cf=Z({opType:K.TANH}),wf={kernelName:fn,backendName:`webgpu`,kernelFunc:Cf}
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2022 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
;
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Tf(e){let{inputs:t,backend:n,attrs:r}=e,{tensor:i,indices:a,updates:o}=t,{}=r,{sliceRank:s,numUpdates:c,sliceSize:l,strides:u,outputSize:d}=w(o,a,i.shape),f=[d/l,l];if(d===0)return n.makeTensorInfo(i.shape,a.dtype);let p=[],m=Y({inputs:{x:a},backend:n,attrs:{shape:[c,s]}});p.push(m);let h=Y({inputs:{x:o},backend:n,attrs:{shape:[c,l]}});p.push(h);let g=Y({inputs:{x:i},backend:n,attrs:{shape:f}});p.push(g);let _=nf({inputs:{x:g},backend:n,attrs:{reps:Array(f.length).fill(1)}}),v=new wd([c,l],s,m.shape.length,h.shape.length,u,f,i.dtype,!1),y=N([c,l]),b=[{type:`int32`,data:[s]},{type:`int32`,data:u},{type:`int32`,data:[y]}],x=n.runWebGPUProgram(v,[h,m],g.dtype,b,_);p.push(x);let S=Y({inputs:{x},backend:n,attrs:{shape:i.shape}});return p.forEach(e=>n.disposeData(e.dataId)),S}const Ef={kernelName:we,backendName:`webgpu`,kernelFunc:Tf};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Df=class{constructor(e){this.variableNames=[`x`,`indices`],this.workgroupSize=[256,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.uniforms=`inputSize : i32, firstPass : i32, negativeInf : f32,
        dir : i32, inc : i32,`,this.shaderKey=`swap`}getUserCode(){return`
        ${B(`index`)} {
          if (index < uniforms.size) {
            let outC = getCoordsFromIndex(index);
            let batch = outC[0];
            let elemIdx = outC[1];
            // We compare elements pair-wise within a group of size 2 * inc.
            // The comparing rule for each group alternates between ascending
            // and descending. Within each group, we compare each pair at
            // positions i and i+inc. To decide whether an element at position i
            // is x0 or x1, we mod it by 2 * inc, if the result is smaller than
            // inc, it is in the first half of the group, we denote it as x0,
            // otherwise we denote it as x1.
            // For example, as shown in the Bitonic top K paper referenced
            // above, Figure5(a) shows that element[1] is in the second half of
            // the group when group size is 2, but it is in the first half of
            // the group when group size is 4.
            let isFirstInPair = elemIdx % (2 * uniforms.inc) < uniforms.inc;
            var i = 0;
            if (isFirstInPair) {
              i = elemIdx;
            } else {
              i = elemIdx - uniforms.inc;
            }

            var i0 = 0;
            if (uniforms.firstPass == 1) {
              i0 = i;
            } else {
              i0 = i32(getIndices(batch, i));
            }

            var i1 = 0;
            if (uniforms.firstPass == 1) {
              i1 = i + uniforms.inc;
            } else {
              i1 = i32(getIndices(batch, i + uniforms.inc));
            }

            var x0 = f32(0.0);
            var x1 = f32(0.0);
            if (i0 < uniforms.inputSize) {
              x0 = getX(batch, i0);
            } else {
              x0 = uniforms.negativeInf;
            }
            if (i1 < uniforms.inputSize) {
              x1 = getX(batch, i1);
            } else {
              x1 = uniforms.negativeInf;
            }

            let reverse = elemIdx % (2 * uniforms.dir) >= uniforms.dir;
            let isGreater = x0 > x1 || (x0 == x1 && i1 > i0);
            if (reverse == isGreater) {
              // Elements in opposite order of direction
              let iTemp = i0;
              i0 = i1;
              i1 = iTemp;
            }
            if (isFirstInPair) {
              setOutputAtIndex(index, f32(i0));
            } else {
              setOutputAtIndex(index, f32(i1));
            }
          }
        }
      `}},Of=class{constructor(e){this.variableNames=[`x`,`indices`],this.workgroupSize=[256,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.uniforms=`inputSize : i32, firstPass : i32, k : i32,`,this.shaderKey=`merge`}getUserCode(){return`
        ${B(`index`)} {
          if (index < uniforms.size) {
            let outC = getCoordsFromIndex(index);
            let batch = outC[0];
            let elemIdx = outC[1];
            // The output size is half of the previous size.
            // If the previous sequence is | | | | _ _ _ _  | | | |  _ _ _ _
            // (k=4), we only need to output the indices at positions |, the
            // indices at positions _ can be thrown away, see Figure5(b) After
            // Phase 2 (Merge phase) in the Bitonic Top K paper referenced
            // above.
            // For example, the paper shows we only need to output the orange
            // bars. The output sequence should look like this | | | | | | | |.
            // Because the sequence is halved, to map the output index back to
            // the previous sequence to find the corresponding value, we need
            // to double the index. When we double the index, we basically
            // interpolate a position, so 2i looks like
            // | _ | _ | _ | _ | _ | _ | _. We move the | to the first k
            // position of each 2k positions by - elemIdx % k. E.g. for output
            // at index 4,5,6,7, we want to get the corresponding element at
            // original index 8,9,10,11, for output at index 8,9,10,11,
            // we want to get the corresponding element at original index
            // 16,17,18,19, so on and so forth.

            var i = 0;
            if (elemIdx < uniforms.k) {
              i = elemIdx;
            } else {
              i = elemIdx * 2 - elemIdx % uniforms.k;
            }
            var i0 = 0;
            if (uniforms.firstPass == 1) {
              i0 = i;
            } else {
              i0 = i32(getIndices(batch, i));
            }
            var i1 = 0;
            if (uniforms.firstPass == 1) {
              i1 = i + uniforms.k;
            } else {
              i1 = i32(getIndices(batch, i + uniforms.k));
            }

            let x0 = getX(batch, i0);
            var x1 = f32(0.0);
            if (i1 < uniforms.inputSize) {
              x1 = getX(batch, i1);
            } else {
              x1 = x0;
            }

            if (x0 >= x1) {
              setOutputAtIndex(index, f32(i0));
            } else {
              setOutputAtIndex(index, f32(i1));
            }
          }
        }
      `}};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function kf(e,t){t!==null&&e.disposeData(t.dataId)}function Af(e){let t=1;for(;t<e;)t*=2;return t}function jf(e){let{inputs:t,backend:n,attrs:r}=e,{x:i}=t,{k:a,sorted:o}=r,s=i.shape,c=s[s.length-1];if(n.shouldExecuteOnCPU([i])){let e=n.readSync(i.dataId),[t,r]=va(e,s,i.dtype,a,o);return[n.makeTensorInfo(t.shape,t.dtype,t.values),n.makeTensorInfo(r.shape,r.dtype,r.values)]}if(a===0)return s[s.length-1]=0,[n.makeTensorInfo(s,i.dtype,[]),n.makeTensorInfo(s,`int32`,[])];if(c===1)return[i,J({attrs:{shape:s,dtype:`int32`,value:0},backend:n})];let l=N(s)/c,u=Y({inputs:{x:i},attrs:{shape:[l,c]},backend:n}),d=Af(a),f=Af(c),p=null,m=()=>p===null?[u,u]:[u,p],h=(e,t,r)=>{let i=m(),a=new Df(r),o=[{type:`int32`,data:[c]},{type:`int32`,data:[+(p===null)]},{type:`float32`,data:[-1/0]},{type:`int32`,data:[e]},{type:`int32`,data:[t]}],s=p;p=n.runWebGPUProgram(a,i,`int32`,o),kf(n,s)};for(let e=1;e<d;e*=2){let t=e*2;for(let n=e;n>=1;n/=2)h(t,n,[l,f])}for(let e=f;e>d;e/=2){let t=m(),r=new Of([l,e/2]),i=[{type:`int32`,data:[c]},{type:`int32`,data:[+(p===null)]},{type:`int32`,data:[d]}],a=p;p=n.runWebGPUProgram(r,t,`int32`,i),kf(n,a);let o=d/2,s=o*2;for(let e=o;e>=1;e/=2)h(s,e,p.shape)}let g=p;p=Eo({inputs:{x:p},backend:n,attrs:{begin:0,size:[l,a]}}),kf(n,g);let _=fl({inputs:{x:u,indices:p},backend:n,attrs:{axis:1,batchDims:1}});kf(n,u);let v=s.slice(0,-1);v.push(a),g=p,p=Y({inputs:{x:p},attrs:{shape:v},backend:n}),kf(n,g);let y=_;return _=Y({inputs:{x:_},attrs:{shape:v},backend:n}),kf(n,y),[_,p]}const Mf={kernelName:Ie,backendName:`webgpu`,kernelFunc:jf};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Nf=class{constructor(e){this.variableNames=[`Image`,`Transforms`],this.uniforms=`interpolationModeId : i32, fillModeId : i32, fillValue : f32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=U(this.outputShape),this.dispatch=H(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey=`transform`}getUserCode(){return`
          fn mapCoord(outCoord : f32, len : f32) -> f32{
            var inCoord = outCoord;
            if(uniforms.fillModeId == 2) {
              if (inCoord < 0.0) {
                if (len <= 1.0) {
                  inCoord = 0.0;
                } else {
                  let sz2 = 2.0 * len;
                  if (inCoord < sz2) {
                    inCoord = sz2 * f32(i32(f32(-inCoord / sz2))) +
                    inCoord;
                  }
                  if (inCoord < -len) {
                    inCoord = inCoord + sz2;
                  } else {
                    inCoord = -inCoord - 1.0;
                  }
                }
              } else if (inCoord > len - 1.0) {
                if (len <= 1.0) {
                  inCoord = 0.0;
                } else {
                  let sz2 = 2.0 * len;
                  inCoord = inCoord - sz2 * f32(i32(f32(inCoord / sz2)));
                  if (inCoord >= len) {
                    inCoord = sz2 - inCoord - 1.0;
                  }
                }
              }
              return clamp(inCoord, 0.0, len - 1.0);
            } else if (uniforms.fillModeId == 3) {
              if (inCoord < 0.0) {
                if (len <= 1.0) {
                  inCoord = 0.0;
                } else {
                  let sz = len - 1.0;
                  inCoord = inCoord + len * (f32(i32(f32(-inCoord / sz))) + 1.0);
                }
              } else if (inCoord > len - 1.0) {
                if (len <= 1.0) {
                  inCoord = 0.0;
                } else {
                  let sz = len - 1.0;
                  inCoord = inCoord - len * f32(i32(f32(inCoord / sz)));
                }
              }
              return clamp(inCoord, 0.0, len - 1.0);
            } else if (uniforms.fillModeId == 4) {
              return clamp(outCoord, 0.0, len - 1.0);
            }
            return outCoord;
          }
          fn readWithFillValue(batch : i32, coordY : i32, coordX : i32,
            channel : i32) -> f32 {
            var outputValue : f32;
            if (0 <= coordY && coordY < uniforms.imageShape[1] && 0 <= coordX && coordX < uniforms.imageShape[2]) {
                outputValue = getImage(batch, coordY, coordX, channel);
            } else {
              outputValue = uniforms.fillValue;
            }
            return outputValue;
          }

          ${B(`index`)} {
            if (index < uniforms.size) {
              let coords = getCoordsFromIndex(index);
              var outputValue : f32;
              let batch = coords[0];
              let x = coords[2];
              let y = coords[1];
              let channel = coords[3];
              let xf = f32(x);
              let yf = f32(y);
              let a1 = getTransforms(batch, 0);
              let a2 = getTransforms(batch, 1);
              let a3 = getTransforms(batch, 2);
              let b1 = getTransforms(batch, 3);
              let b2 = getTransforms(batch, 4);
              let b3 = getTransforms(batch, 5);
              let c1 = getTransforms(batch, 6);
              let c2 = getTransforms(batch, 7);
              let projection = c1 * xf + c2 * yf + 1.0;
              if (projection == 0.0) {
                outputValue = uniforms.fillValue;
              } else {
                let inX = (a1 * xf + a2 * yf + a3) / projection;
                let inY = (b1 * xf + b2 * yf + b3) / projection;
                let mapX = mapCoord(inX, f32(uniforms.imageShape[2]));
                let mapY = mapCoord(inY, f32(uniforms.imageShape[1]));

                if (uniforms.interpolationModeId == 1) {
                  let coordY = i32(round(mapY));
                  let coordX = i32(round(mapX));
                  outputValue = readWithFillValue(batch, coordY, coordX,
                    channel);
                } else {
                  let yFloor = floor(mapY);
                  let xFloor = floor(mapX);
                  let yCeil = yFloor + 1.0;
                  let xCeil = xFloor + 1.0;
                  let valueYFloor = (xCeil - mapX) *
                  readWithFillValue(batch, i32(yFloor), i32(xFloor), channel) +
                  (mapX - xFloor) *
                  readWithFillValue(batch, i32(yFloor), i32(xCeil), channel);
                  let valueYCeil = (xCeil - mapX) *
                  readWithFillValue(batch, i32(yCeil), i32(xFloor), channel) +
                  (mapX - xFloor) *
                  readWithFillValue(batch, i32(yCeil), i32(xCeil), channel);
                  outputValue = (yCeil - mapY) * valueYFloor +
                  (mapY - yFloor) * valueYCeil;
                }
              }
              setOutputAtIndex(index, outputValue);
            }
          }
        `}};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function Pf(e){let{inputs:t,backend:n,attrs:r}=e,{image:i,transforms:a}=t,{interpolation:o,fillMode:s,fillValue:c,outputShape:l}=r,[u,d,f,p]=i.shape,[m,h]=l??[d,f],g=new Nf([u,m,h,p]),_=o===`nearest`?1:2,v;switch(s){case`constant`:v=1;break;case`reflect`:v=2;break;case`wrap`:v=3;break;case`nearest`:v=4;break;default:v=1}let y=[{type:`int32`,data:[_]},{type:`int32`,data:[v]},{type:`float32`,data:[c]}];return n.runWebGPUProgram(g,[i,a],`float32`,y)}const Ff={kernelName:E,backendName:`webgpu`,kernelFunc:Pf};
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function If(e){let{inputs:t,backend:n,attrs:r}=e,{value:i}=t,{axis:a}=r;a<0&&(a+=i.shape.length);let o=i,s=o.shape.length,c=i.shape[a],l=Array(s-1),u=0;for(let e=0;e<s;e++)e!==a&&(l[u++]=o.shape[e]);let d=[],f=Array(s).fill(0),p=o.shape.slice();p[a]=1;let m=Array(c);for(let e=0;e<m.length;e++){f[a]=e;let t=Eo({inputs:{x:o},backend:n,attrs:{begin:f,size:p}}),r=Y({inputs:{x:t},backend:n,attrs:{shape:l}});m[e]=r,d.push(t)}return d.forEach(e=>n.disposeData(e.dataId)),m}const Lf={kernelName:be,backendName:`webgpu`,kernelFunc:If};
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
var Rf=class{constructor(e,t,n){if(this.outputShape=[],this.variableNames=[`x`,`segmentIds`],this.uniforms=`numSegments : i32, xSize: i32,`,this.workgroupSize=[64,1,1],this.atomic=!0,this.outputShape=t,this.dispatchLayout=U(e),this.dispatch=H(this.dispatchLayout,e,this.workgroupSize),n!==`float32`&&n!==`int32`)throw Error(`UnsortedSegmentSum only supports float32 and int32
              types, does not support ${n} type.`);this.type=n,this.shaderKey=`unsortedSegmentSum`}getUserCode(){return`
    ${B(`index`)} {
      if (index < uniforms.xSize) {
        let coords = getXCoordsFromIndex(index);
        let b = coords[0];
        let inCol = coords[1];

        let segmentId = i32(getSegmentIds(inCol));
        if (segmentId >= 0) {
          let flatIndex = b * uniforms.numSegments + segmentId % uniforms.numSegments;
          let value = getX(b, inCol);

          ${I(`&result[flatIndex]`,`value`,this.type)}
        }
      }
    }
  `}};
/**
* @license
* Copyright 2023 Google LLC.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function zf(e){let{inputs:t,backend:n,attrs:r}=e,{x:i,segmentIds:a}=t,{numSegments:o}=r,s=i.shape.length,l=[],u=0,d=c([u],s),f=i;d!=null&&(f=$({inputs:{x:i},backend:n,attrs:{perm:d}}),l.push(f),u=nt(1,s)[0]);let p=an(f.shape,u,o),m=N([f.shape[u]]),h=Y({inputs:{x:f},backend:n,attrs:{shape:[-1,m]}});l.push(h);let g=i.dtype,_=[h.shape[0],o],v=J({backend:n,attrs:{shape:_,value:0,dtype:g}}),y=new Rf(h.shape,_,g),b=[{type:`int32`,data:[o]},{type:`int32`,data:[N(h.shape)]}],x=n.runWebGPUProgram(y,[h,a],g,b,v),S=Y({inputs:{x},backend:n,attrs:{shape:p}});l.push(x);let C=S;if(d!=null){l.push(S);let e=ne(d);C=$({inputs:{x:C},backend:n,attrs:{perm:e}})}return l.forEach(e=>n.disposeData(e.dataId)),C}
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
const Bf=[Ni,xa,Ca,Ta,Ea,ka,Ra,Ba,Ua,Ga,qa,Ya,Za,$a,to,fo,mo,vo,bo,So,Oo,Mo,Fo,Ho,Wo,Jo,Ri,Qo,as,hs,xs,Ts,Os,As,Ms,Ns,Fs,Ls,Ws,Ks,Js,Zs,oc,cc,nc,dc,mc,vc,bc,Cc,kc,Ac,jc,Nc,Pc,Fc,Lc,zc,Uc,ki,Gc,Zc,qc,Yc,nl,il,ol,ll,pl,hl,_l,Ii,yl,ts,xl,Cl,Tl,Dl,kl,jl,Pl,Ll,Fl,zl,Vl,Ul,Jl,Zl,oo,$l,tu,lu,ru,su,du,co,pu,hu,_u,vu,wu,Tc,Eu,Ou,Au,Lo,Nu,Lu,zu,Hu,Uu,Gu,qu,Ju,zo,Xu,Qu,ed,nd,Ai,ad,cd,dd,md,_d,yd,xd,Cd,Ed,kd,Md,Pd,Id,Rd,zd,Vd,Do,hf,vf,bf,Su,Ud,Gd,Zd,$d,of,cf,uf,df,pf,xf,Dc,Sf,wf,Ef,rf,Mf,Ff,Na,Lf,{kernelName:We,backendName:`webgpu`,kernelFunc:zf},Fu];for(let e of Bf)Nn(e);
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
