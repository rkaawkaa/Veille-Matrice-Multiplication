#include <vector>
#include <chrono>
#include <emscripten.h>
using namespace std;

extern "C" {

double matrix_mult(const vector<vector<float>> &matrix1, const vector<vector<float>> &matrix2) {
auto start = chrono::high_resolution_clock::now();
vector<vector<float>> result;
for (int i = 0; i < matrix1.size(); i++) {
result.push_back(vector<float>());
for (int j = 0; j < matrix2[0].size(); j++) {
float sum = 0;
for (int k = 0; k < matrix1[0].size(); k++) {
sum += matrix1[i][k] * matrix2[k][j];
}
result[i].push_back(sum);
}
}
auto stop = chrono::high_resolution_clock::now();
auto elapsed = chrono::duration_castchrono::milliseconds(stop - start);
return elapsed.count();
}

}




