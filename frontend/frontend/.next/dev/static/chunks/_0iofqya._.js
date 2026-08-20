(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/node_modules/framer-motion/dist/es/value/use-combine-values.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCombineMotionValues",
    ()=>useCombineMotionValues
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$motion$2d$dom$2f$dist$2f$es$2f$frameloop$2f$frame$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/motion-dom/dist/es/frameloop/frame.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$use$2d$isomorphic$2d$effect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/utils/use-isomorphic-effect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/value/use-motion-value.mjs [app-client] (ecmascript)");
"use client";
;
;
;
function useCombineMotionValues(values, combineValues) {
    /**
     * Initialise the returned motion value. This remains the same between renders.
     */ const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMotionValue"])(combineValues());
    /**
     * Create a function that will update the template motion value with the latest values.
     * This is pre-bound so whenever a motion value updates it can schedule its
     * execution in Framesync. If it's already been scheduled it won't be fired twice
     * in a single frame.
     */ const updateValue = ()=>value.set(combineValues());
    /**
     * Synchronously update the motion value with the latest values during the render.
     * This ensures that within a React render, the styles applied to the DOM are up-to-date.
     */ updateValue();
    /**
     * Subscribe to all motion values found within the template. Whenever any of them change,
     * schedule an update.
     */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$use$2d$isomorphic$2d$effect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsomorphicLayoutEffect"])({
        "useCombineMotionValues.useIsomorphicLayoutEffect": ()=>{
            const scheduleUpdate = {
                "useCombineMotionValues.useIsomorphicLayoutEffect.scheduleUpdate": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$motion$2d$dom$2f$dist$2f$es$2f$frameloop$2f$frame$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["frame"].preRender(updateValue, false, true)
            }["useCombineMotionValues.useIsomorphicLayoutEffect.scheduleUpdate"];
            const subscriptions = values.map({
                "useCombineMotionValues.useIsomorphicLayoutEffect.subscriptions": (v)=>v.on("change", scheduleUpdate)
            }["useCombineMotionValues.useIsomorphicLayoutEffect.subscriptions"]);
            return ({
                "useCombineMotionValues.useIsomorphicLayoutEffect": ()=>{
                    subscriptions.forEach({
                        "useCombineMotionValues.useIsomorphicLayoutEffect": (unsubscribe)=>unsubscribe()
                    }["useCombineMotionValues.useIsomorphicLayoutEffect"]);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$motion$2d$dom$2f$dist$2f$es$2f$frameloop$2f$frame$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cancelFrame"])(updateValue);
                }
            })["useCombineMotionValues.useIsomorphicLayoutEffect"];
        }
    }["useCombineMotionValues.useIsomorphicLayoutEffect"]);
    return value;
}
;
}),
"[project]/node_modules/framer-motion/dist/es/value/use-computed.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useComputed",
    ()=>useComputed
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$motion$2d$dom$2f$dist$2f$es$2f$value$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/motion-dom/dist/es/value/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$combine$2d$values$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/value/use-combine-values.mjs [app-client] (ecmascript)");
"use client";
;
;
function useComputed(compute) {
    /**
     * Open session of collectMotionValues. Any MotionValue that calls get()
     * will be saved into this array.
     */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$motion$2d$dom$2f$dist$2f$es$2f$value$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collectMotionValues"].current = [];
    compute();
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$combine$2d$values$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCombineMotionValues"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$motion$2d$dom$2f$dist$2f$es$2f$value$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collectMotionValues"].current, compute);
    /**
     * Synchronously close session of collectMotionValues.
     */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$motion$2d$dom$2f$dist$2f$es$2f$value$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collectMotionValues"].current = undefined;
    return value;
}
;
}),
"[project]/node_modules/framer-motion/dist/es/value/use-motion-value.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useMotionValue",
    ()=>useMotionValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$motion$2d$dom$2f$dist$2f$es$2f$value$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/motion-dom/dist/es/value/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$context$2f$MotionConfigContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/context/MotionConfigContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$use$2d$constant$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/utils/use-constant.mjs [app-client] (ecmascript)");
"use client";
;
;
;
;
/**
 * Creates a `MotionValue` to track the state and velocity of a value.
 *
 * Usually, these are created automatically. For advanced use-cases, like use with `useTransform`, you can create `MotionValue`s externally and pass them into the animated component via the `style` prop.
 *
 * ```jsx
 * export const MyComponent = () => {
 *   const scale = useMotionValue(1)
 *
 *   return <motion.div style={{ scale }} />
 * }
 * ```
 *
 * @param initial - The initial state.
 *
 * @public
 */ function useMotionValue(initial) {
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$use$2d$constant$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useConstant"])({
        "useMotionValue.useConstant[value]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$motion$2d$dom$2f$dist$2f$es$2f$value$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionValue"])(initial)
    }["useMotionValue.useConstant[value]"]);
    /**
     * If this motion value is being used in static mode, like on
     * the Framer canvas, force components to rerender when the motion
     * value is updated.
     */ const { isStatic } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$context$2f$MotionConfigContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MotionConfigContext"]);
    if (isStatic) {
        const [, setLatest] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initial);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
            "useMotionValue.useEffect": ()=>value.on("change", setLatest)
        }["useMotionValue.useEffect"], []);
    }
    return value;
}
;
}),
"[project]/node_modules/framer-motion/dist/es/value/use-transform.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTransform",
    ()=>useTransform
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$motion$2d$dom$2f$dist$2f$es$2f$utils$2f$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/motion-dom/dist/es/utils/transform.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$use$2d$constant$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/utils/use-constant.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$combine$2d$values$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/value/use-combine-values.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$computed$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/value/use-computed.mjs [app-client] (ecmascript)");
"use client";
;
;
;
;
function useTransform(input, inputRangeOrTransformer, outputRangeOrMap, options) {
    if (typeof input === "function") {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$computed$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComputed"])(input);
    }
    /**
     * Detect if outputRangeOrMap is an output map (object with keys)
     * rather than an output range (array).
     */ const isOutputMap = outputRangeOrMap !== undefined && !Array.isArray(outputRangeOrMap) && typeof inputRangeOrTransformer !== "function";
    if (isOutputMap) {
        return useMapTransform(input, inputRangeOrTransformer, outputRangeOrMap, options);
    }
    const outputRange = outputRangeOrMap;
    const transformer = typeof inputRangeOrTransformer === "function" ? inputRangeOrTransformer : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$motion$2d$dom$2f$dist$2f$es$2f$utils$2f$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transform"])(inputRangeOrTransformer, outputRange, options);
    const result = Array.isArray(input) ? useListTransform(input, transformer) : useListTransform([
        input
    ], {
        "useTransform.useListTransform": ([latest])=>transformer(latest)
    }["useTransform.useListTransform"]);
    const inputAccelerate = !Array.isArray(input) ? input.accelerate : undefined;
    if (inputAccelerate && !inputAccelerate.isTransformed && typeof inputRangeOrTransformer !== "function" && Array.isArray(outputRangeOrMap) && options?.clamp !== false) {
        result.accelerate = {
            ...inputAccelerate,
            times: inputRangeOrTransformer,
            keyframes: outputRangeOrMap,
            isTransformed: true,
            ...options?.ease ? {
                ease: options.ease
            } : {}
        };
    }
    return result;
}
function useListTransform(values, transformer) {
    const latest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$use$2d$constant$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useConstant"])({
        "useListTransform.useConstant[latest]": ()=>[]
    }["useListTransform.useConstant[latest]"]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$combine$2d$values$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCombineMotionValues"])(values, {
        "useListTransform.useCombineMotionValues": ()=>{
            latest.length = 0;
            const numValues = values.length;
            for(let i = 0; i < numValues; i++){
                latest[i] = values[i].get();
            }
            return transformer(latest);
        }
    }["useListTransform.useCombineMotionValues"]);
}
function useMapTransform(inputValue, inputRange, outputMap, options) {
    /**
     * Capture keys once to ensure hooks are called in consistent order.
     */ const keys = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$use$2d$constant$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useConstant"])({
        "useMapTransform.useConstant[keys]": ()=>Object.keys(outputMap)
    }["useMapTransform.useConstant[keys]"]);
    const output = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$use$2d$constant$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useConstant"])({
        "useMapTransform.useConstant[output]": ()=>({})
    }["useMapTransform.useConstant[output]"]);
    for (const key of keys){
        output[key] = useTransform(inputValue, inputRange, outputMap[key], options);
    }
    return output;
}
;
}),
"[project]/node_modules/motion-dom/dist/es/utils/transform.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "transform",
    ()=>transform
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$motion$2d$dom$2f$dist$2f$es$2f$utils$2f$interpolate$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/motion-dom/dist/es/utils/interpolate.mjs [app-client] (ecmascript)");
;
function transform(...args) {
    const useImmediate = !Array.isArray(args[0]);
    const argOffset = useImmediate ? 0 : -1;
    const inputValue = args[0 + argOffset];
    const inputRange = args[1 + argOffset];
    const outputRange = args[2 + argOffset];
    const options = args[3 + argOffset];
    const interpolator = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$motion$2d$dom$2f$dist$2f$es$2f$utils$2f$interpolate$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["interpolate"])(inputRange, outputRange, options);
    return useImmediate ? interpolator(inputValue) : interpolator;
}
;
}),
"[project]/src/components/ui/AmbientGlow.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AmbientGlow",
    ()=>AmbientGlow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$scroll$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/value/use-scroll.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/value/use-transform.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function AmbientGlow({ color = "bg-[#757D5C]", opacity = 0.06, position = "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", width = "w-[800px] max-w-[90vw]", height = "h-[800px] max-h-[90vw]", className = "", animationDelay = 0, shape = "organic1" }) {
    _s();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { scrollYProgress } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$scroll$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScroll"])({
        target: ref,
        offset: [
            "start end",
            "end start"
        ]
    });
    // Extremely subtle scroll-based vertical drift
    const y = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"])(scrollYProgress, [
        0,
        1
    ], [
        "-6%",
        "6%"
    ]);
    // Custom organic border radii for non-circular, art-directed shapes
    // This avoids obvious geometric circles and performs better than SVG filters
    const radii = {
        organic1: "40% 60% 70% 30% / 40% 50% 60% 50%",
        organic2: "60% 40% 30% 70% / 60% 30% 70% 40%",
        organic3: "50% 50% 70% 30% / 30% 60% 40% 70%"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: `absolute pointer-events-none z-0 ${position} ${className}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            style: {
                y,
                borderRadius: radii[shape]
            },
            animate: {
                scale: [
                    1,
                    1.04,
                    1
                ],
                rotate: [
                    0,
                    4,
                    -2,
                    0
                ],
                opacity: [
                    opacity,
                    opacity * 1.15,
                    opacity
                ]
            },
            transition: {
                duration: 25 + animationDelay * 3,
                repeat: Infinity,
                ease: "linear",
                delay: animationDelay
            },
            className: `blur-[140px] md:blur-[180px] ${width} ${height} ${color}`
        }, void 0, false, {
            fileName: "[project]/src/components/ui/AmbientGlow.tsx",
            lineNumber: 46,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/AmbientGlow.tsx",
        lineNumber: 45,
        columnNumber: 5
    }, this);
}
_s(AmbientGlow, "w5ZdYfEZcXaaY6r06Rgcg2ryUN4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$scroll$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScroll"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"]
    ];
});
_c = AmbientGlow;
var _c;
__turbopack_context__.k.register(_c, "AmbientGlow");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_0iofqya._.js.map