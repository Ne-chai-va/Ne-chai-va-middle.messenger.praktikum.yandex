export type Indexed<T = unknown> = {
  [key in string]: T;
};

function isObject(value: unknown): value is Indexed {
  return (
    typeof value === "object" && value !== null && value.constructor === Object
  );
}

function merge(lhs: Indexed, rhs: Indexed): Indexed {
  for (const p in rhs) {
    if (!Object.prototype.hasOwnProperty.call(rhs, p)) {
      continue;
    }

    try {
      const rhsValue = rhs[p];
      const lhsValue = lhs[p];

      if (isObject(rhsValue) && isObject(lhsValue)) {
        lhs[p] = merge(lhsValue, rhsValue) as unknown;
      } else {
        lhs[p] = rhsValue;
      }
    } catch (e) {
      lhs[p] = rhs[p];
    }
  }

  return lhs;
}

export default merge;
