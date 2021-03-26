export interface CategoriesState {
    isVideo: boolean;
    isCategoriesLoaded: boolean;
    categories: Array<string>;
    chosenCategory: string | null;
    chosenCategoryCases: Array<string>;
    chosenVideo: string | null;
    chosenPhoto: string | null;
    error?: Error | any;
    isLoading: boolean;
}

export const initialState: CategoriesState = {
    isVideo: true,
    isCategoriesLoaded: false,
    categories: null,
    chosenCategory: null,
    chosenCategoryCases: null,
    chosenVideo: null,
    chosenPhoto: null,
    error: null,
    isLoading: false,
};
