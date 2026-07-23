import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { castDraft } from 'immer';
import { executeGraphQL } from '@api/graphqlClient';

export interface SalesforceObjectCollectionState<TRecord> {
  records: TRecord[];
  loading: boolean;
  error: string | null;
}

export interface SalesforceObjectCollectionDefinition<TRecord, TGraphQLData> {
  sliceName: string;
  query: string;
  fallbackErrorMessage: string;
  selectRecords: (data: TGraphQLData) => TRecord[];
}

export function createSalesforceObjectCollection<TRecord, TGraphQLData>(
  definition: SalesforceObjectCollectionDefinition<TRecord, TGraphQLData>
) {
  const initialState: SalesforceObjectCollectionState<TRecord> = {
    records: [],
    loading: false,
    error: null,
  };

  const fetchRecords = createAsyncThunk<
    TRecord[],
    void,
    { rejectValue: string }
  >(`${definition.sliceName}/fetchRecords`, async (_, { rejectWithValue }) => {
    try {
      const data = await executeGraphQL<TGraphQLData, void>(definition.query);
      return definition.selectRecords(data);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : definition.fallbackErrorMessage
      );
    }
  });

  const slice = createSlice({
    name: definition.sliceName,
    initialState,
    reducers: {
      clearError: (state) => {
        state.error = null;
      },
      setRecords: (state, action: PayloadAction<TRecord[]>) => {
        state.records = castDraft(action.payload);
      },
      resetCollection: (state) => {
        state.records = castDraft([] as TRecord[]);
        state.loading = false;
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchRecords.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchRecords.fulfilled, (state, action) => {
          state.loading = false;
          state.records = castDraft(action.payload);
        })
        .addCase(fetchRecords.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload ?? definition.fallbackErrorMessage;
        });
    },
  });

  return {
    fetchRecords,
    reducer: slice.reducer,
    actions: slice.actions,
  };
}
