import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface TemplateVersion {
  id: string;
  template_id: string;
  active: number;
  name: string;
  generate_plain_content: boolean;
  updated_at: string;
  editor: string;
  thumbnail_url: string;
  html_content?: string;
  plain_content?: string;
}

export interface Template {
  generation: string;
  id: string;
  name: string;
  updated_at: string;
  versions: TemplateVersion[] 
}

interface Response {
  _metadata: {
    count: number;
    self: string;
  };
  result: Template[];
}

interface ResponseError {
  error: string;
}

interface TemplatesState {
  templates: Template[];
  template: Template | null;
  loading: boolean;
  error: string | null;
}

const initialState: TemplatesState = {
  templates: [],
  template: null,
  loading: false,
  error: null,
};

const SENDGRID_API_KEY = process.env.EXPO_PUBLIC_SENDGRID_API_KEY || '';
const BASE_URL = 'https://api.sendgrid.com/v3';

export const fetchTemplates = createAsyncThunk(
  'templates/fetchTemplates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/templates?page_size=100&generations=dynamic`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }

      const data: Response = await response.json();
      return data.result; // Devuelve solo el array de plantillas
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTemplateById = createAsyncThunk(
  'templates/fetchTemplateById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/templates/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch template');
      }

      const data: Template = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
)



const templatesSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action: PayloadAction<Template[]>) => {
        state.loading = false;
        state.templates = action.payload;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTemplateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplateById.fulfilled, (state, action: PayloadAction<Template>) => {
        state.loading = false;
        state.template = action.payload;
      })
      .addCase(fetchTemplateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default templatesSlice.reducer;
