export interface SalesforceFieldValue<TValue> {
  value: TValue;
}

export interface SalesforceEdge<TNode> {
  node: TNode;
}

export type SalesforceObjectQueryResult<
  TQueryName extends string,
  TNode
> = {
  uiapi: {
    query: {
      [key in TQueryName]: {
        edges: SalesforceEdge<TNode>[];
      };
    };
  };
};
