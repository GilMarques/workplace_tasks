namespace Domain
{
    public class PagedResult<T>
    {
        public IReadOnlyList<T> Items { get; init; } = [];
        public int TotalCount { get; init; }
        public int Limit { get; init; }
        public int Offset { get; init; }

        public int CurrentPage => Limit > 0 ? (Offset / Limit) + 1 : 1;
        public int TotalPages => Limit > 0 ? (int)Math.Ceiling((double)TotalCount / Limit) : 1;

        public PagedResult(IReadOnlyList<T> items, int totalCount, int limit, int offset)
        {
            Items = items;
            TotalCount = totalCount;

            Limit = limit > 0 ? limit : 1;
            Offset = offset;
        }
    }
}
