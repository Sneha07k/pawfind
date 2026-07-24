package com.pawfind.dto.favorite;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FavoriteToggleResponse {
    private boolean favorited;
}