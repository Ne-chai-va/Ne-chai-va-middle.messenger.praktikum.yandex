export type PlainObject = {
  [k in string]: unknown;
};

function isPlainObject(value: unknown): value is PlainObject {
  return (
    typeof value === "object" &&
    value !== null &&
    value.constructor === Object &&
    Object.prototype.toString.call(value) === "[object Object]"
  );
}

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

function isArrayOrObject(value: unknown): value is unknown[] | PlainObject {
  return isPlainObject(value) || isArray(value);
}

function isEqual(lhs: unknown, rhs: unknown): boolean {
  if (lhs === rhs) {
    return true;
  }

  if (!isArrayOrObject(lhs) || !isArrayOrObject(rhs)) {
    return false;
  }

  if (isArray(lhs) && isArray(rhs)) {
    if (lhs.length !== rhs.length) {
      return false;
    }
    return lhs.every((value, index) => isEqual(value, rhs[index]));
  }

  if (isPlainObject(lhs) && isPlainObject(rhs)) {
    const lhsKeys = Object.keys(lhs);
    const rhsKeys = Object.keys(rhs);

    if (lhsKeys.length !== rhsKeys.length) {
      return false;
    }

    for (const key of lhsKeys) {
      if (!isEqual(lhs[key], rhs[key])) {
        return false;
      }
    }

    return true;
  }

  return false;
}

export default isEqual;
