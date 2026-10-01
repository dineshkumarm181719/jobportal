package com.jobportal.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PagedResponse<T> {
    private boolean success;
    private List<T> data;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean last;

    public static <T> PagedResponse<T> of(List<T> data, int page, int size, long totalElements, int totalPages, boolean last) {
        return PagedResponse.<T>builder()
                .success(true)
                .data(data)
                .page(page)
                .size(size)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .last(last)
                .build();
    }
}
